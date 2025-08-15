// @ts-ignore
import * as PIXI from 'pixi.js';

export default class PixiShaderSmoke {
  container;
  width = 640;
  height = 960;
  smokeHeight = '3.0';
  onload?: () => void;

  constructor({
    container,
    height,
    onload,
  }: {
    container: HTMLElement;
    height: string;
    onload?: () => void;
  }) {
    this.container = container;
    this.width = this.container?.clientWidth || this.width;
    this.height = this.container?.clientHeight || this.height;
    this.smokeHeight = height || this.smokeHeight;
    this.onload = onload;

    this.init();
  }

  init() {
    var stage = new PIXI.Stage(true);

    var renderer = PIXI.autoDetectRenderer(this.width, this.height, {
      transparent: false,
    });

    this.container.appendChild(renderer.view);

    var uniforms: { [key: string]: { type: string; value: any } } = {};
    uniforms.resolution = {
      type: '2f',
      value: {
        x: this.width,
        y: this.height,
      },
    };
    uniforms.alpha = {
      type: '1f',
      value: 1.0,
    };
    uniforms.shift = {
      type: '1f',
      value: 1.6,
    };
    uniforms.time = {
      type: '1f',
      value: 0,
    };
    uniforms.speed = {
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
      'const vec3 c5 = vec3(0.6);',
      'const vec3 c6 = vec3(0.9);',

      'vec2 p = gl_FragCoord.xy * 10.0 / resolution.xx;',
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

    var coolFilter = new PIXI.AbstractFilter(fragmentSrc, uniforms);

    var bg = PIXI.Sprite.fromImage(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/167451/test_BG.jpg',
    );
    bg.width = this.width;
    bg.height = this.height;
    bg.shader = coolFilter;
    stage.addChild(bg);

    bg.texture.baseTexture.on('loaded', () => {
      this.onload?.();
    });

    var count = 0;

    const animate = () => {
      count += 0.01;

      coolFilter.uniforms.time.value = count;
      coolFilter.syncUniforms();

      renderer.render(stage);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
