export const LIQUID_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const LIQUID_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uGrainTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uVelocity;
  uniform float uGrainIntensity;
  uniform vec2 uResolution;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(0.11, -0.14);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uv = (vUv - 0.5) * aspect;

    vec2 flow = uv * 1.4 - uPointer * 0.25;
    float t = uTime * 0.14;
    float q = fbm(flow + vec2(t, -t * 0.7));
    float h = fbm(flow + q * (0.85 + uVelocity * 0.45) + vec2(-t * 0.5, t * 0.4));

    // Crisp liquid caustics on deep #0F0F0F
    vec3 baseDark = vec3(0.0588, 0.0588, 0.0588);
    vec3 purple = vec3(0.541, 0.169, 0.886);
    vec3 electric = vec3(0.349, 0.0, 1.0);
    vec3 slate = vec3(0.553, 0.599, 0.682);

    float band = smoothstep(0.58, 0.86, h);
    float highlight = smoothstep(0.76, 0.94, h);
    float vignette = 1.0 - smoothstep(0.25, 1.15, length(uv));

    vec3 tint = mix(electric, purple, clamp(uScroll * 0.8 + h * 0.5, 0.0, 1.0));
    vec3 color = baseDark;
    color += tint * band * 0.28 * vignette;
    color += mix(purple, slate, 0.35) * highlight * (0.24 + uVelocity * 0.18);

    // Subtle 24 fps procedural grain
    float grain = hash21(gl_FragCoord.xy + vec2(uGrainTime * 37.0, uGrainTime * 71.0)) - 0.5;
    color += grain * uGrainIntensity * 0.75;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;
