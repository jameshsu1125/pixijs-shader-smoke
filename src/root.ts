// @ts-ignore
import { smokeMachine } from './smoke';

const createApp = () => {
  return new Promise<HTMLElement[]>((resolve) => {
    const canvasWithImage = document.createElement('canvas');
    const ctx = canvasWithImage.getContext('2d');
    const img = new Image();
    img.src = '/bg-taipei.jpg';
    img.onload = () => {
      canvasWithImage.width = 640;
      canvasWithImage.height = 960;
      ctx?.drawImage(img, 0, 0, 640, 960);
    };

    var party = smokeMachine(ctx, [54, 16.8, 18.2], 0.5);
    party.start(); // start animating

    onmousemove = function (e) {
      var x = e.clientX;
      var y = e.clientY;
      var n = 0.5;
      var t = 500;
      party.addsmoke(x, y, n, t);
    };

    setInterval(function () {
      party.addsmoke(canvasWithImage.width / 2, canvasWithImage.height, 1, 1000, 0.1);
    }, 50);

    //

    resolve([canvasWithImage]);
  });
};

export default createApp;

const appElement = document.getElementById('app');
if (appElement && appElement.children.length === 0) {
  createApp().then((app) => {
    app.forEach((element) => {
      appElement.appendChild(element);
    });
  });
}
