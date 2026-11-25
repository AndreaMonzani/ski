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
      p = rot * p * 2.02 + vec2(0.13, -0.17);
      amp *= 0.5;
    }
    return v;
  }

  float heightField(vec2 p) {
    vec2 warpOffset = uPointer * 0.45;
    float warpStrength = 0.65 + uVelocity * 0.55;
    vec2 q = vec2(
      fbm(p + warpOffset + vec2(0.0, uTime * 0.14)),
      fbm(p - warpOffset + vec2(5.2, 1.3 - uTime * 0.11))
    );
    vec2 r = vec2(
      fbm(p + warpStrength * q + vec2(1.7, 9.2) + uTime * 0.08),
      fbm(p + warpStrength * q + vec2(8.3, 2.8) - uTime * 0.09)
    );
    return fbm(p + warpStrength * r);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uvCentered = (vUv - 0.5) * aspect;

    vec2 trailShift = -normalize(uPointer + vec2(0.0001)) * uVelocity * 0.08;
    vec2 p = (uvCentered + trailShift) * 1.55;

    float h = heightField(p);
    float eps = 0.012;
    float hx = heightField(p + vec2(eps, 0.0));
    float hy = heightField(p + vec2(0.0, eps));

    vec3 normal = normalize(vec3((h - hx) * 4.5, (h - hy) * 4.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(uPointer.x * 0.8 + 0.35, uPointer.y * 0.8 + 0.55, 0.9));

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 36.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);

    vec3 baseDark = vec3(0.0588, 0.0588, 0.0588);
    vec3 purpleMain = vec3(0.541, 0.169, 0.886);
    vec3 electric = vec3(0.349, 0.0, 1.0);
    vec3 slate = vec3(0.553, 0.599, 0.682);

    float purpleWeight = mix(0.42, 0.68, smoothstep(0.0, 0.6, uScroll));
    float electricWeight = mix(0.25, 0.52, abs(sin(uScroll * 3.14159)));

    vec3 liquidTint = mix(electric, purpleMain, clamp(h * 1.15 + fresnel * 0.4, 0.0, 1.0));
    liquidTint = mix(liquidTint, slate * 0.55, smoothstep(0.65, 0.95, h) * 0.35);

    float intensity = smoothstep(0.25, 0.88, h) * (0.34 + purpleWeight * 0.25);
    vec3 color = baseDark + liquidTint * intensity;

    float glow = (spec * 0.55 + fresnel * (0.35 + electricWeight * 0.3));
    vec3 halationColor = mix(purpleMain, vec3(0.92, 0.35, 1.0), fresnel * 0.5);
    color += halationColor * glow;

    float grain = hash21(gl_FragCoord.xy + vec2(uGrainTime * 37.0, uGrainTime * 71.0)) - 0.5;
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float lumaMask = mix(1.0, 0.45, smoothstep(0.15, 0.75, lum));
    color += grain * uGrainIntensity * lumaMask;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;
