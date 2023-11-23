import {
  BoxGeometry,
  EdgesGeometry,
  GridHelper,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Ray,
  Scene,
  SphereGeometry,
  TetrahedronGeometry,
  Vector3,
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

import { UiService } from '../services/ui.service';
import {
  IProteccionBloquesValue,
  IProteccionForm,
  IProteccionFormValue,
} from './interfaces/interface';
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
  private protectionSphere!: Mesh;
  private structures: LineSegments[] = [];
  activeIndex: number = 1;
  resultadosValue: any[] = [];

  public fieldOfView: number = 60;
  public nearClippingPane: number = 1;
  public farClippingPane: number = 1100;
  form: FormGroup<IProteccionForm> = this.proteccionForm.build();
  controls!: OrbitControls;
  ray!: Ray;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  get formBloques() {
    return this.form.controls.bloques;
  }

  constructor(
    public readonly proteccionForm: ProteccionFormService,
    private readonly uiService: UiService
  ) {}

  ngOnInit(): void {
    this.formBloques.push(this.proteccionForm.bluidBloques());
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.createLight();
    this.createCamera();
    this.startRendering();
    this.addControls();
    this.activeIndex = 0;
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
  }

  calcular() {
    if (this.form.invalid) {
      this.uiService.showError('Por favor llenar todos los campos requeridos');
      return this.form.markAllAsTouched();
    }
    this.resultadosValue = [];
    const value = this.form.value as IProteccionFormValue;
    const radio = value.nivelRiesgo;
    const values = value.bloques.map((item) => {
      const d = item.longitudPunta;
      const e = radio - d;
      const j = Math.sqrt(Math.pow(radio, 2) - Math.pow(e, 2));
      const k = 2 * j;
      const p = k / Math.sqrt(2);
      const pyAprox = Math.ceil(item.largo / p);
      const pxAprox = Math.ceil(item.ancho / p);

      let py = Math.max(pyAprox, 2);
      let px = Math.max(pxAprox, 2);

      if (pyAprox === 1 && pxAprox === 1) {
        py = 1;
        px = 1;
      }

      if (item.largo / py < p) py += 1;
      if (item.ancho / px < p) px += 1;

      this.resultadosValue.push({
        separacion: p,
        total: py * px,
        totalx: px,
        totaly: py,
      });

      return {
        px,
        py,
      };
    });
    this.limpiarPuntas();

    this.clearStructures();
    this.limpiarPuntas();
    value.bloques.forEach((item, index) => {
      this.addStructure(item, index);
      this.agregarPuntas(item, values[index]);
    });
    this.renderFn();
    this.uiService.showSuccess('Modelo cargado exitosamente');
  }
  private limpiarPuntas() {
    const puntas = this.scene.children.filter(
      (item) =>
        (item as Mesh).geometry instanceof TetrahedronGeometry ||
        (item as Mesh).geometry instanceof BoxGeometry
    );
    puntas.forEach((punta) => this.scene.remove(punta));
  }

  private clearStructures(): void {
    this.scene.children
      .filter((item) => {
        return (item as Mesh).geometry instanceof EdgesGeometry; //||
      })
      .forEach((item) => {
        this.scene.remove(item);
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
    const gridHelper = new GridHelper(200, 200);
    this.scene.add(gridHelper);
  }

  private addSphere(value: IProteccionBloquesValue, sphereRadius: number) {
    const geometry = new SphereGeometry(sphereRadius, 32, 32);
    const material = new MeshBasicMaterial({
      color: 'black',
    });

    this.protectionSphere = new Mesh(geometry, material);
    this.protectionSphere.position.x = value.ancho + sphereRadius;
    this.protectionSphere.position.y = sphereRadius;

    this.scene.add(this.protectionSphere);
  }

  private clearSphere(): void {
    this.scene.children
      .filter((item) => (item as Mesh).geometry instanceof SphereGeometry)
      .forEach((item) => {
        this.scene.remove(item);
      });
  }

  private agregarPuntas(
    value: IProteccionBloquesValue,
    result: { px: number; py: number }
  ) {
    const punta = new TetrahedronGeometry(0.5, 0);
    punta.applyMatrix4(
      new Matrix4().makeRotationAxis(
        new Vector3(1, 0, -1).normalize(),
        Math.atan(Math.sqrt(2))
      )
    );
    const plane = new BoxGeometry(0.1, value.longitudPunta - 0.1, 0.1);
    const material = new MeshBasicMaterial({
      color: 'yellow',
    });

    const halfZ = value.largo / 2;
    const halfX = value.ancho / 2;

    if (result.px === 1 && result.py === 1) {
      const mesh = new Mesh(punta, material);
      mesh.position.setY(value.alto + value.longitudPunta);
      const meshLine = new Mesh(plane, material);
      meshLine.position.setY(value.alto + value.longitudPunta / 2);
      this.scene.add(meshLine);
      this.scene.add(mesh);
      return;
    }

    const stepX = value.ancho / (result.px - 1);
    const stepZ = value.largo / (result.py - 1);
    for (let posZ = -1 * halfZ; posZ < halfZ + stepZ; posZ += stepZ) {
      for (let posX = -1 * halfX; posX < halfX + stepX; posX += stepX) {
        const mesh = new Mesh(punta, material);
        const meshLine = new Mesh(plane, material);
        mesh.position.setY(value.alto + value.longitudPunta);
        mesh.position.setZ(posZ);
        mesh.position.setX(posX);

        meshLine.position.setY(value.alto + value.longitudPunta / 2);
        meshLine.position.setZ(posZ);
        meshLine.position.setX(posX);
        this.scene.add(meshLine);
        this.scene.add(mesh);
      }
    }
  }

  private readonly addStructure = (
    item: IProteccionBloquesValue,
    index: number
  ) => {
    const plane = new BoxGeometry(item.ancho, item.alto, item.largo);
    const edges = new EdgesGeometry(plane);
    this.structures[index] = new LineSegments(
      edges,
      new LineBasicMaterial({ color: 'black' })
    );
    const material = new MeshBasicMaterial({
      color: '#1fc9d0',
    });

    this.structures[index].position.set(0, item.alto / 2, 0);
    const mesh = new Mesh(plane, material);
    mesh.position.set(0, item.alto / 2, 0);
    this.scene.add(this.structures[index]);
    this.scene.add(mesh);
    this.renderFn();
  };

  validateField(id: string, index?: number): boolean {
    let form = this.form.get(id);
    if (!isNaN(index!)) form = this.formBloques.controls[index!].get(id);
    if (!form) return false;
    return form.touched && form.invalid;
  }

  agregarBloque() {
    this.formBloques.push(this.proteccionForm.bluidBloques());
  }

  deleteBloq(index: number) {
    this.formBloques.removeAt(index);
    this.structures.splice(index, 1);
  }
}
