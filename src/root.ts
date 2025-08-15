import PixiShaderSmoke from '.';

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

    const container = document.createElement('div');
    container.className = 'smoke';

    new PixiShaderSmoke({ container, height: '5.0' });

    resolve([canvasWithImage, container]);
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
