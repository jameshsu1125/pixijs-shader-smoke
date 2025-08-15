import EnterFrame from 'lesca-enterframe';
// @ts-ignore
import * as PIXI from 'pixi.js';

export default class PixiShaderSmoke {
  container;
  width = 640;
  height = 960;
  smokeHeight = '3.0';
  c5 = '1.0';
  c6 = '1.2';
  noise = '5.0';
  onload?: () => void;
  shaderImage: string = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/167451/test_BG.jpg';
  renderer: PIXI.Renderer | null = null;
  uniforms: { [key: string]: { type: string; value: any } } = {};
  bg: PIXI.Sprite | null = null;
  fps: number = 30;

  constructor({
    container,
    height,
    onload,
    c5,
    c6,
    noise,
    shaderImage,
    fps,
  }: {
    container: HTMLElement;
    height: string;
    onload?: () => void;
    c5?: string;
    c6?: string;
    noise?: string;
    shaderImage?: string;
    fps?: number;
  }) {
    this.container = container;
    this.width = this.container?.clientWidth || this.width;
    this.height = this.container?.clientHeight || this.height;
    this.smokeHeight = height || this.smokeHeight;
    this.onload = onload;

    this.c5 = c5 || this.c5;
    this.c6 = c6 || this.c6;
    this.noise = noise || this.noise;
    this.shaderImage = shaderImage || this.shaderImage;
    this.fps = fps || this.fps;

    this.init();
  }

  init() {
    var stage = new PIXI.Stage(true);

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
      transparent: false,
    });

    this.container.appendChild(this.renderer.view);

    // this.uniforms: { [key: string]: { type: string; value: any } } = {};
    this.uniforms.resolution = {
      type: '2f',
      value: {
        x: this.width,
        y: this.height,
      },
    };
    this.uniforms.alpha = {
      type: '1f',
      value: 1.0,
    };
    this.uniforms.shift = {
      type: '1f',
      value: 1.6,
    };
    this.uniforms.time = {
      type: '1f',
      value: 0,
    };
    this.uniforms.speed = {
      type: '2f',
      value: {
        x: 0.7,
        y: 0.4,
      },
    };

    var fragmentSrc = [
      'precision mediump float;',
      'uniform vec2      resolution;',
      'uniform float     time;',
      'uniform float     alpha;',
      'uniform vec2      speed;',
      'uniform float     shift;',

      'float rand(vec2 n) {',
      'return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);',
      '}',

      'float noise(vec2 n) {',
      'const vec2 d = vec2(0.0, 1.0);',
      'vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));',
      'return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);',
      '}',

      'float fbm(vec2 n) {',
      'float total = 0.0, amplitude = 0.4;',
      'for (int i = 0; i < 4; i++) {',
      'total += noise(n) * amplitude;',
      'n += n;',
      'amplitude *= 0.6;',
      '}',
      'return total;',
      '}',

      'void main() {',

      'const vec3 c1 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);',
      'const vec3 c2 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);',
      'const vec3 c3 = vec3(0.0, 0.0, 0.0);',
      'const vec3 c4 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);',
      `const vec3 c5 = vec3(${this.c5});`,
      `const vec3 c6 = vec3(${this.c6});`,

      `vec2 p = gl_FragCoord.xy * ${this.noise} / resolution.xx;`,
      'float q = fbm(p - time * 0.1);',
      'vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));',
      'vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);',
      `float grad = gl_FragCoord.y / resolution.y * ${this.smokeHeight};`,
      'gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 1.0);',
      'gl_FragColor.xyz *= 0.6-grad;',
      'float test = 0.6-grad;',
      'float testVal = 0.5;',
      'if(r.x > 0.5 || r.y > 0.5 || fbm(p + r) > 0.5 || test < 0.2 ){',
      'gl_FragColor.w = 0.2;',
      '}',
      '}',
    ];

    const coolFilter = new PIXI.AbstractFilter(fragmentSrc, this.uniforms);

    this.bg = PIXI.Sprite.fromImage(this.shaderImage);
    this.bg.width = this.width;
    this.bg.height = this.height;
    this.bg.shader = coolFilter;
    stage.addChild(this.bg);

    this.bg.texture.baseTexture.on('loaded', () => {
      this.onload?.();
    });

    let count = 0;
    EnterFrame.setFPS(this.fps);
    EnterFrame.add(() => {
      count += 0.01;
      coolFilter.uniforms.time.value = count;
      coolFilter.syncUniforms();

      this.renderer.render(stage);
    });
    EnterFrame.play();
  }

  resizeTo(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.renderer) {
      this.renderer.resize(width, height);
      this.uniforms.resolution.value = {
        x: width,
        y: height,
      };
      this.bg.width = width;
      this.bg.height = height;
    }
  }
}
