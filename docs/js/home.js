document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  //  REVELADO AL HACER SCROLL
  // ============================================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============================================================
  //  SLIDER DE LA SEDE
  // ============================================================
  const slides = Array.from(document.querySelectorAll(".venue-slide"));
  const dotsContainer = document.getElementById("venueDots");

  if (slides.length && dotsContainer) {
    let currentIndex = 0;
    let intervalId = null;

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "venue-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(index);
        restartAuto();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".venue-dot"));

    function goToSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      currentIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function startAuto() {
      intervalId = setInterval(nextSlide, 4000);
    }

    function restartAuto() {
      clearInterval(intervalId);
      startAuto();
    }

    goToSlide(0);
    startAuto();
  }

  // ============================================================
  //  TRANSICIÓN DE IMÁGENES CON THREE.JS (integrado en el hero)
  // ============================================================
  function initImageTransition() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Configuración básica
    const IMAGE_WIDTH = 100;
    const IMAGE_HEIGHT = 60;
    const CAMERA_Z = 60;

    // Rutas a tus imágenes (ajusta según tu estructura)
    const IMAGES = {
      horizontal: 'images/logos/Horizontal_logo_Ganador.png',
      vertical:   'images/logos/Horizontal_logo_Ganador.png'
    };

    // ---------- CLASE THREERoot ----------
    function THREERoot(params) {
      params = Object.assign({
        fov: 80,
        zNear: 10,
        zFar: 100000,
        createCameraControls: false,
        antialias: window.devicePixelRatio === 1
      }, params);

      this.renderer = new THREE.WebGLRenderer({
        antialias: params.antialias,
        alpha: true
      });
      this.renderer.setClearColor(0x000000, 0); // fondo transparente
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(
        params.fov,
        container.clientWidth / container.clientHeight,
        params.zNear,
        params.zFar
      );
      this.camera.position.set(0, 0, CAMERA_Z);

      this.scene = new THREE.Scene();

      if (params.createCameraControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      }

      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);

      this.resize();
      this.tick();

      window.addEventListener('resize', this.resize, false);
    }

    THREERoot.prototype = {
      tick: function() {
        this.update();
        this.render();
        requestAnimationFrame(this.tick);
      },
      update: function() {
        if (this.controls) this.controls.update();
      },
      render: function() {
        this.renderer.render(this.scene, this.camera);
      },
      resize: function() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };

    // ---------- CLASE SLIDE ----------
    function Slide(width, height, animationPhase) {
      const plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2);
      THREE.BAS.Utils.separateFaces(plane);

      const geometry = new SlideGeometry(plane);
      geometry.bufferUVs();

      const aAnimation = geometry.createAttribute('aAnimation', 2);
      const aStartPosition = geometry.createAttribute('aStartPosition', 3);
      const aControl0 = geometry.createAttribute('aControl0', 3);
      const aControl1 = geometry.createAttribute('aControl1', 3);
      const aEndPosition = geometry.createAttribute('aEndPosition', 3);

      const minDuration = 0.8;
      const maxDuration = 1.2;
      const maxDelayX = 0.9;
      const maxDelayY = 0.125;
      const stretch = 0.11;

      this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;

      const startPos = new THREE.Vector3();
      const control0 = new THREE.Vector3();
      const control1 = new THREE.Vector3();
      const endPos = new THREE.Vector3();
      const temp = new THREE.Vector3();

      function getControlPoint0(centroid) {
        const signY = Math.sign(centroid.y);
        temp.x = THREE.Math.randFloat(0.1, 0.3) * 50;
        temp.y = signY * THREE.Math.randFloat(0.1, 0.3) * 70;
        temp.z = THREE.Math.randFloatSpread(20);
        return temp.clone();
      }

      function getControlPoint1(centroid) {
        const signY = Math.sign(centroid.y);
        temp.x = THREE.Math.randFloat(0.3, 0.6) * 50;
        temp.y = -signY * THREE.Math.randFloat(0.3, 0.6) * 70;
        temp.z = THREE.Math.randFloatSpread(20);
        return temp.clone();
      }

      let i, i2, i3, i4, v;

      for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < geometry.faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
        const face = plane.faces[i];
        const centroid = THREE.BAS.Utils.computeCentroid(plane, face);

        const duration = THREE.Math.randFloat(minDuration, maxDuration);
        const delayX = THREE.Math.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
        let delayY;
        if (animationPhase === 'in') {
          delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY);
        } else {
          delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0);
        }

        for (v = 0; v < 6; v += 2) {
          aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * stretch * duration);
          aAnimation.array[i2 + v + 1] = duration;
        }

        endPos.copy(centroid);
        startPos.copy(centroid);

        if (animationPhase === 'in') {
          control0.copy(centroid).sub(getControlPoint0(centroid));
          control1.copy(centroid).sub(getControlPoint1(centroid));
        } else {
          control0.copy(centroid).add(getControlPoint0(centroid));
          control1.copy(centroid).add(getControlPoint1(centroid));
        }

        for (v = 0; v < 9; v += 3) {
          aStartPosition.array[i3 + v]     = startPos.x;
          aStartPosition.array[i3 + v + 1] = startPos.y;
          aStartPosition.array[i3 + v + 2] = startPos.z;

          aControl0.array[i3 + v]     = control0.x;
          aControl0.array[i3 + v + 1] = control0.y;
          aControl0.array[i3 + v + 2] = control0.z;

          aControl1.array[i3 + v]     = control1.x;
          aControl1.array[i3 + v + 1] = control1.y;
          aControl1.array[i3 + v + 2] = control1.z;

          aEndPosition.array[i3 + v]     = endPos.x;
          aEndPosition.array[i3 + v + 1] = endPos.y;
          aEndPosition.array[i3 + v + 2] = endPos.z;
        }
      }

      const material = new THREE.BAS.BasicAnimationMaterial(
        {
          shading: THREE.FlatShading,
          side: THREE.DoubleSide,
          uniforms: {
            uTime: { type: 'f', value: 0 }
          },
          shaderFunctions: [
            THREE.BAS.ShaderChunk['cubic_bezier'],
            THREE.BAS.ShaderChunk['ease_in_out_cubic']
          ],
          shaderParameters: [
            'uniform float uTime;',
            'attribute vec2 aAnimation;',
            'attribute vec3 aStartPosition;',
            'attribute vec3 aControl0;',
            'attribute vec3 aControl1;',
            'attribute vec3 aEndPosition;'
          ],
          shaderVertexInit: [
            'float tDelay = aAnimation.x;',
            'float tDuration = aAnimation.y;',
            'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
            'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
          ],
          shaderTransformPosition: [
            (animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
            'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
          ]
        },
        {
          map: new THREE.Texture()
        }
      );

      THREE.Mesh.call(this, geometry, material);
      this.frustumCulled = false;
    }

    Slide.prototype = Object.create(THREE.Mesh.prototype);
    Slide.prototype.constructor = Slide;

    Object.defineProperty(Slide.prototype, 'time', {
      get: function() { return this.material.uniforms.uTime.value; },
      set: function(v) { this.material.uniforms.uTime.value = v; }
    });

    Slide.prototype.setImage = function(image) {
      this.material.uniforms.map.value.image = image;
      this.material.uniforms.map.value.needsUpdate = true;
    };

    Slide.prototype.transition = function() {
      return TweenMax.fromTo(this, 3.0, { time: 0.0 }, { time: this.totalDuration, ease: Power0.easeInOut });
    };

    // ---------- GEOMETRÍA PERSONALIZADA ----------
    function SlideGeometry(model) {
      THREE.BAS.ModelBufferGeometry.call(this, model);
    }
    SlideGeometry.prototype = Object.create(THREE.BAS.ModelBufferGeometry.prototype);
    SlideGeometry.prototype.constructor = SlideGeometry;

    SlideGeometry.prototype.bufferPositions = function() {
      const positionBuffer = this.createAttribute('position', 3).array;
      for (let i = 0; i < this.faceCount; i++) {
        const face = this.modelGeometry.faces[i];
        const centroid = THREE.BAS.Utils.computeCentroid(this.modelGeometry, face);
        const a = this.modelGeometry.vertices[face.a];
        const b = this.modelGeometry.vertices[face.b];
        const c = this.modelGeometry.vertices[face.c];

        positionBuffer[face.a * 3]     = a.x - centroid.x;
        positionBuffer[face.a * 3 + 1] = a.y - centroid.y;
        positionBuffer[face.a * 3 + 2] = a.z - centroid.z;

        positionBuffer[face.b * 3]     = b.x - centroid.x;
        positionBuffer[face.b * 3 + 1] = b.y - centroid.y;
        positionBuffer[face.b * 3 + 2] = b.z - centroid.z;

        positionBuffer[face.c * 3]     = c.x - centroid.x;
        positionBuffer[face.c * 3 + 1] = c.y - centroid.y;
        positionBuffer[face.c * 3 + 2] = c.z - centroid.z;
      }
    };

    // ---------- INICIALIZACIÓN ----------
    const root = new THREERoot({
      createCameraControls: false,
      antialias: window.devicePixelRatio === 1,
      fov: 80
    });

    const slideOut = new Slide(IMAGE_WIDTH, IMAGE_HEIGHT, 'out');
    const slideIn  = new Slide(IMAGE_WIDTH, IMAGE_HEIGHT, 'in');

    const loader = new THREE.ImageLoader();
    loader.setCrossOrigin('Anonymous');

    loader.load(IMAGES.horizontal, (img) => {
      slideOut.setImage(img);
    });
    loader.load(IMAGES.vertical, (img) => {
      slideIn.setImage(img);
    });

    root.scene.add(slideOut);
    root.scene.add(slideIn);

    const tl = new TimelineMax({
      repeat: -1,
      repeatDelay: 1.0,
      yoyo: true
    });

    tl.add(slideOut.transition(), 0);
    tl.add(slideIn.transition(), 0);

    // ---------- SCRUBBER (control manual) ----------
    function createTweenScrubber(tween, seekSpeed) {
      seekSpeed = seekSpeed || 0.001;

      function stop() {
        TweenMax.to(tween, 1, { timeScale: 0 });
      }

      function resume() {
        TweenMax.to(tween, 1, { timeScale: 1 });
      }

      function seek(dx) {
        const progress = tween.progress();
        const p = THREE.Math.clamp(progress + (dx * seekSpeed), 0, 1);
        tween.progress(p);
      }

      let _cx = 0;
      let mouseDown = false;
      const canvas = root.renderer.domElement;
      canvas.style.cursor = 'pointer';

      canvas.addEventListener('mousedown', (e) => {
        mouseDown = true;
        canvas.style.cursor = 'ew-resize';
        _cx = e.clientX;
        stop();
        e.preventDefault();
      });

      window.addEventListener('mouseup', () => {
        if (mouseDown) {
          mouseDown = false;
          canvas.style.cursor = 'pointer';
          resume();
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (mouseDown) {
          const cx = e.clientX;
          const dx = cx - _cx;
          _cx = cx;
          seek(dx);
          e.preventDefault();
        }
      });

      canvas.addEventListener('touchstart', (e) => {
        _cx = e.touches[0].clientX;
        stop();
        e.preventDefault();
      });

      canvas.addEventListener('touchend', (e) => {
        resume();
        e.preventDefault();
      });

      canvas.addEventListener('touchmove', (e) => {
        const cx = e.touches[0].clientX;
        const dx = cx - _cx;
        _cx = cx;
        seek(dx);
        e.preventDefault();
      });
    }

    createTweenScrubber(tl);

    // Atajo de teclado P para pausar
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 80) {
        tl.paused(!tl.paused());
      }
    });
  }

  // Iniciar la transición después de que todo esté cargado
  initImageTransition();
});