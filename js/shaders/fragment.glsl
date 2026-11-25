uniform sampler2D uImage1; 
uniform sampler2D uImage2; 
uniform sampler2D uDepth;  
uniform vec2 uMouse;       
uniform float uTime;
uniform vec2 uResolution;
uniform float uImageAspect;

varying vec2 vUv;

void main() {
    // 1. Calcolo Object-Fit: Cover per le immagini
    float screenAspect = uResolution.x / uResolution.y;
    vec2 ratio = vec2(
        min(screenAspect / uImageAspect, 1.0),
        min((1.0 / screenAspect) * uImageAspect, 1.0)
    );
    
    vec2 coverUv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // Estrazione depth sulla UV mappata
    vec4 depth = texture2D(uDepth, coverUv);
    
    // Distorsione liquida
    vec2 displacedUv = coverUv + (depth.r * 0.05 * sin(uTime * 2.0)); 

    vec4 tex1 = texture2D(uImage1, coverUv); 
    vec4 tex2 = texture2D(uImage2, displacedUv); 

    // 2. Correzione Aspect Ratio per un cursore PERFETTAMENTE circolare
    vec2 st = vUv;
    st.x *= screenAspect;
    vec2 mouse = uMouse;
    mouse.x *= screenAspect;

    float dist = distance(st, mouse);
    
    // Raggio del cerchio cursore (ammorbidito)
    float radius = 0.25; 
    float feather = 0.12;
    float mask = smoothstep(radius + feather, radius - feather, dist);

    // 3. Offset del pallino luminoso più naturale
    vec2 offset = vec2(0.015, -0.015); 
    float distLight = distance(st, mouse + offset);
    float lightMask = smoothstep(0.12, 0.0, distLight) * 0.7; 
    
    // Colore luce (var--color-3)
    vec3 lightColor = vec3(0.51, 0.66, 0.75) * lightMask; 

    // Unione finale
    vec4 finalColor = mix(tex1, tex2, mask);
    finalColor.rgb += lightColor;

    gl_FragColor = finalColor;
}