import {
  AxesHelper,
  BoxGeometry,
  EdgesGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IProteccionForm, IProteccionFormValue } from './interfaces/interface';
import { ProteccionFormService } from './services/proteccion-form.service';

@Component({
  selector: 'app-proteccion-contra-rayos',
  templateUrl: './proteccion-contra-rayos.component.html',
  styleUrls: ['./proteccion-contra-rayos.component.scss'],
})
export class ProteccionContraRayosComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('canvas') canvasRef!: ElementRef;

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private protectionSphere!: Line;
  private structure: LineSegments | null = null;

  nivelProteccionValue: string | null = null;

  width: number = 2;
  length: number = 2;
  height: number = 2;
  radiusOfProtection: number = 0;

  public fieldOfView: number = 60;
  public nearClippingPane: number = 1;
  public farClippingPane: number = 1100;
  form: FormGroup<IProteccionForm> = this.proteccionForm.build();
  controls!: OrbitControls;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(public readonly proteccionForm: ProteccionFormService) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe({
      next: () => this.addStructure(),
    });
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.createLight();
    this.createCamera();
    this.startRendering();
    this.addControls();
    this.addFloor();
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
  }

  calcular() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const value = this.form.value as IProteccionFormValue;
    const radio = value.nivelRiesgo;

    const d = value.longitudPunta;
    const e = radio - d;
    const j = Math.sqrt(Math.pow(radio, 2) - Math.pow(e, 2));
    const k = 2 * j;
    const p = k / Math.sqrt(2);

    const px = Math.ceil(value.ancho / p);
    const py = Math.ceil(value.largo / p);

    console.log({
      d,
      e,
      j,
      k,
      p,
      px,
      py,
    });
  }

  public addControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', () => this.renderFn());
  }

  public renderFn() {
    this.renderer.render(this.scene, this.camera);
  }

  private startRendering() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = true;

    requestAnimationFrame(() => this.renderFn());
  }

  private createCamera(): void {
    const aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );

    // Set position and look at
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 100;
  }

  private getAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private createLight(): void {
    const light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 100);
    this.scene.add(light);

    const light2 = new PointLight(0xffffff, 1, 1000);
    light2.position.set(0, 0, -100);
    this.scene.add(light2);
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.add(new AxesHelper(200));
  }

  private addFloor() {
    const plane = new PlaneGeometry(10, 10);
    const mesh = new MeshNormalMaterial();
    const floor = new Mesh(plane, mesh);
    floor.rotateX(-Math.PI / 2);
    this.scene.add(floor);
  }

  private addSphere() {
    const geometry = new SphereGeometry(2, 32, 32);
    const material = new MeshBasicMaterial({
      color: 'black',
    });

    this.protectionSphere = new Line(geometry, material);
    this.protectionSphere.position.x = this.width + 2;

    this.scene.add(this.protectionSphere);
  }

  private addStructure() {
    const value = this.form.value as IProteccionFormValue;
    this.scene.remove(this.structure!);
    this.structure = null;
    const plane = new BoxGeometry(value.ancho, value.alto, value.largo);
    const edges = new EdgesGeometry(plane);
    this.structure = new LineSegments(
      edges,
      new LineBasicMaterial({ color: 'black' })
    );
    this.structure.position.set(
      value.ancho / 2,
      value.alto / 2,
      value.largo / 2
    );
    this.scene.add(this.structure);
    this.renderFn();
  }

  public onMouseDown(event: MouseEvent) {
    event.preventDefault();

    const raycaster = new Raycaster();
    const mouse = new Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
  }

  validateField(id: string): boolean {
    const form = this.form.get(id)!;
    return form.touched && form.invalid;
  }
}
