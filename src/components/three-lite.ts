/**
 * 파티클 엠블럼이 쓰는 three.js 부품만 골라서 다시 내보냅니다.
 * 이 파일을 통해 불러오면 쓰지 않는 나머지는 빌드에서 빠집니다.
 */
export {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
