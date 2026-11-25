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

  // High-frequency, non-tiling screen-space film grain
  float interleavedGradientNoise(vec2 uv) {
    vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(uv, magic.xy)));
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
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
    vec2 pointerUv = uPointer * 0.5 * aspect;

    // Interactive liquid flow displaced by pointer position & velocity
    vec2 flow = uv * 1.25 - pointerUv * 0.45;
    float t = uTime * 0.14;
    float q = fbm(flow + vec2(t, -t * 0.7));
    float h = fbm(flow + q * (0.9 + uVelocity * 0.65) + vec2(-t * 0.4, t * 0.35));

    vec3 baseDark = vec3(0.0588, 0.0588, 0.0588); // #0F0F0F
    vec3 purple = vec3(0.541, 0.169, 0.886);      // #8A2BE2
    vec3 electric = vec3(0.349, 0.0, 1.0);        // #5900FF
    vec3 magenta = vec3(0.86, 0.32, 1.0);

    // Interactive cursor aura + focal glow behind the 3D sculpture
    float cursorGlow = exp(-dot(uv - pointerUv, uv - pointerUv) * 3.8);
    vec2 heroCenter = vec2(0.32, 0.02);
    float heroGlow = exp(-dot(uv - heroCenter, uv - heroCenter) * 2.2);

    float band = smoothstep(0.45, 0.86, h);
    float highlight = smoothstep(0.72, 0.94, h);

    vec3 tint = mix(electric, purple, clamp(uScroll * 0.7 + h * 0.55, 0.0, 1.0));
    vec3 color = baseDark;
    color += tint * band * 0.36;
    color += mix(purple, magenta, 0.4) * heroGlow * 0.38;
    color += magenta * cursorGlow * (0.22 + uVelocity * 0.25);
    color += vec3(0.95, 0.65, 1.0) * highlight * (0.22 + uVelocity * 0.2);

    // Organic 24 fps film grain (zero tiling)
    vec2 grainCoord = gl_FragCoord.xy + vec2(mod(uGrainTime * 19.37, 256.0), mod(uGrainTime * 43.11, 256.0));
    float g = interleavedGradientNoise(grainCoord) - 0.5;
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float lumaMask = mix(1.0, 0.45, smoothstep(0.15, 0.8, lum));
    color += g * uGrainIntensity * lumaMask;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;
