export const LIQUID_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const LIQUID_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

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
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p = rot * p * 2.04 + vec2(0.17, -0.19);
      amp *= 0.5;
    }
    return v;
  }

  float heightField(vec2 p) {
    vec2 warpOffset = uPointer * 0.55;
    float warpStrength = 0.75 + uVelocity * 0.65;
    vec2 q = vec2(
      fbm(p + warpOffset + vec2(0.0, uTime * 0.16)),
      fbm(p - warpOffset + vec2(4.7, 1.9 - uTime * 0.13))
    );
    vec2 r = vec2(
      fbm(p + warpStrength * q + vec2(1.7, 9.2) + uTime * 0.1),
      fbm(p + warpStrength * q + vec2(8.3, 2.8) - uTime * 0.11)
    );
    return fbm(p + warpStrength * r);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uvCentered = (vUv - 0.5) * aspect;

    vec2 trailShift = -normalize(uPointer + vec2(0.0001)) * uVelocity * 0.1;
    vec2 p = (uvCentered + trailShift) * 1.75;

    float h = heightField(p);
    float eps = 0.01;
    float hx = heightField(p + vec2(eps, 0.0));
    float hy = heightField(p + vec2(0.0, eps));

    vec3 normal = normalize(vec3((h - hx) * 6.0, (h - hy) * 6.0, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(uPointer.x * 0.95 + 0.4, uPointer.y * 0.95 + 0.5, 0.85));

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 48.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.6);

    vec3 baseDark = vec3(0.0588, 0.0588, 0.0588);
    vec3 purpleMain = vec3(0.541, 0.169, 0.886);
    vec3 electric = vec3(0.349, 0.0, 1.0);
    vec3 slate = vec3(0.553, 0.599, 0.682);

    float ridge = smoothstep(0.52, 0.88, h);
    float coreEnergy = mix(0.24, 0.42, smoothstep(0.0, 0.7, uScroll));

    vec3 streamTint = mix(electric, purpleMain, clamp(h * 1.2 + fresnel * 0.35, 0.0, 1.0));
    streamTint = mix(streamTint, slate * 0.45, smoothstep(0.72, 0.96, h) * 0.3);

    vec3 color = baseDark + streamTint * (ridge * coreEnergy);

    float halation = spec * 0.65 + fresnel * (0.28 + uVelocity * 0.25);
    vec3 glowTint = mix(purpleMain, vec3(0.9, 0.42, 1.0), spec * 0.6);
    color += glowTint * halation;

    float grain = hash21(gl_FragCoord.xy + vec2(uGrainTime * 41.0, uGrainTime * 73.0)) - 0.5;
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float lumaMask = mix(1.0, 0.4, smoothstep(0.12, 0.75, lum));
    color += grain * uGrainIntensity * lumaMask;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;
