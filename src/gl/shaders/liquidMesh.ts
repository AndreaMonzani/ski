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

    vec2 flow = uv * 1.35 - uPointer * 0.32;
    float t = uTime * 0.16;
    float q = fbm(flow + vec2(t, -t * 0.7));
    float h = fbm(flow + q * (0.95 + uVelocity * 0.55) + vec2(-t * 0.5, t * 0.4));

    vec3 baseDark = vec3(0.0588, 0.0588, 0.0588); // #0F0F0F
    vec3 purple = vec3(0.541, 0.169, 0.886);      // #8A2BE2
    vec3 electric = vec3(0.349, 0.0, 1.0);        // #5900FF
    vec3 magentaGlow = vec3(0.85, 0.25, 1.0);

    // Rich liquid aura + strong halation focal glow on right/center
    float band = smoothstep(0.42, 0.84, h);
    float highlight = smoothstep(0.68, 0.92, h);

    vec2 glowCenter = vec2(0.35 + uPointer.x * 0.18, 0.02 + uPointer.y * 0.14);
    float radialGlow = exp(-dot(uv - glowCenter, uv - glowCenter) * 2.4);

    vec3 tint = mix(electric, purple, clamp(uScroll * 0.75 + h * 0.6, 0.0, 1.0));
    vec3 color = baseDark;
    color += tint * band * 0.46;
    color += mix(purple, magentaGlow, 0.45) * radialGlow * (0.48 + uVelocity * 0.22);
    color += magentaGlow * highlight * (0.38 + uVelocity * 0.25);

    // Strong 24 fps procedural film grain
    float grain = hash21(gl_FragCoord.xy + vec2(uGrainTime * 37.0, uGrainTime * 71.0)) - 0.5;
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float lumaMask = mix(1.0, 0.55, smoothstep(0.15, 0.85, lum));
    color += grain * uGrainIntensity * lumaMask;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;
