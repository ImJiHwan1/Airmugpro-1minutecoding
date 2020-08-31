//전역변수로 사용을 피하기 위하여 아래모양의 지역변수를 사용한다
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) scroll-section
    //새로운 scene에 들어간 순간 true
    let enterNewScene = false;
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        {   //0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            //scroll-section id를 바로 가져와서 사용할수 있게 객체화 시킨다.
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                //opacity와 transform 함수를 사용 하여 변화를 준다
                //start와 end는 애니매이션이 구간을 구현
                // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                videoImageCount: 300,
                imageSequence: [0,299],
                canvas_opacity: [1, 0, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {   //1
            type: 'normal',
            // heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅,normal 에서는 불필요 요소
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {   //2
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 960,
                imageSequence: [0, 959],
                canvas_opacity_in: [0, 1, { start:0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start:0.95, end:1 }],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.4, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.67, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
                pinB_opacity_in: [0, 1, {start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, {start: 0.4, end: 0.77 }],
                pinB_opacity_out: [1, 0, {start: 0.4, end: 0.63 }],
                pinC_opacity_out: [1, 0, {start: 0.4,end: 0.9 }]
            }
        },
        {   //3
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document.querySelector('.image-blend-canvas').getContext('2d'),
                imagePath: [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg'
                ],
                images: []
            },
            values: {
                rect1X: [ 0, 0, { start: 0, end: 0} ],
                rect2X: [ 0, 0, { start: 0, end: 0} ],
                blendHeight: [ 0, 0, { start: 0, end: 0} ],
                canvas_scale: [ 0, 0, { start: 0, end: 0} ],
                canvasCaption_opacity: [ 0, 1, { start: 0, end: 0} ],
                canvasCaption_translateY: [ 20, 0, {start: 0, end: 0 } ],
                rectStartY: 0
            }
        }
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        // console.log(sceneInfo[0].objs.videoImages);
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3
        for (let i = 0; i < sceneInfo[3].objs.imagePath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagePath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
        // console.log(sceneInfo[3].objs.images);
    }

    function checkMenu() {
        if (yOffset > 44) {
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if(sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type = 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // 새로고침 할때도 동일한 currentscene 표시
        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            //현재 스크롤 위치 //
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 scene(scroll-section)에서 스크롤된 범위를 비율로 구하기
        // 현재 scroll된 길이를 현재 scene의 높이를 나눠주면 비율을 구할수있다.
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            //start ~ end 사이에 애니메이션 실행
            //start ~ end 사이의 범위를 구한다음 scrollHeight를 곱해준다.
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];

        }

        return rv;
    }
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

         // console.log(currentScene,currentYOffset);
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // console.log(messageA_opacity_0,messageA_opacity_1);
                // console.log(currentYOffset);
                // console.log( calcValues(values.messageA_opacity,currentYOffset) );
                // console.log(messageA_opacity_in);
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%`;
                } else {
                    //out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                // objs.messageA.style.opacity = messageA_opacity_in;
                // console.log(messageA_opacity_in);
                break;

            case 2:
                // console.log('2 play');
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    // in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }


                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                if (scrollRatio > 0.9) {
                const objs = sceneInfo[3].objs;
                const values = sceneInfo[3].values;
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                // console.log(widthRatio, heightRatio);
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                // console.log(recalculatedInnerWidth, recalculatedInnerHeight);

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // console.log('3 Start');

                //좌우 흰색 박스 그리기
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(
                    parseInt(values.rect1X[0]),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                    );
                objs.context.fillRect(
                    parseInt(values.rect2X[0]),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                    );
                }

                break;

            case 3:
                // console.log('3 play');
                let step = 0;
                // 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                // console.log(widthRatio, heightRatio);
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                // console.log(recalculatedInnerWidth, recalculatedInnerHeight);

                if (!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    // console.log(values.rectStartY);
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                // console.log(objs.canvas.getBoundingClientRect())

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // console.log('3 Start');

                //좌우 흰색 박스 그리기
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                    );
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                    );

                    //캔버스가 브라우저 상단에 닿지 않았다면
                    if(scrollRatio < values.rect1X[2].end) {
                        step = 1;
                        // console.log('캔버스 닿기 전');
                        objs.canvas.classList.remove('sticky');

                    } else {
                        step = 2;
                        // Image Blend
                        // console.log('캔버스 닿은 후');
                        values.blendHeight[0] = 0;
                        values.blendHeight[1] = objs.canvas.height;
                        values.blendHeight[2].start = values.rect1X[2].end;
                        values.blendHeight[2].end = values.rect1X[2].end + 0.2;
                        const blendHeight = calcValues(values.blendHeight, currentYOffset);

                        objs.context.drawImage(objs.images[1],
                            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        );

                        objs.canvas.classList.add('sticky');
                        objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

                        if (scrollRatio > values.blendHeight[2].end) {
                            values.canvas_scale[0] = canvasScaleRatio;
                            values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                            // console.log(values.canvas_scale[1]);
                            values.canvas_scale[2].start = values.blendHeight[2].end;
                            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                            objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale,currentYOffset)})`;
                            objs.canvas.style.marginTop = 0;
                        }
                        if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
                            objs.canvas.classList.remove('sticky');
                            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;

                            values.canvasCaption_opacity[2].start = values.canvas_scale[2].start;
                            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].end;

                            objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
                        }
                    }

                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;

        for (let i = 0; i <currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return; //브라우저 바운스 효과로 인해 마이너스가 되는것을 방지
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
        //document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            if (currentScene === 0 || currentScene === 2) {
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                    if (objs.videoImages[sequence]) {
                        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                    }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
        checkMenu();

        if (!rafState) {
            rafId = requestAnimationFrame(loop);
            rafState = true;
        }
    });

    // load는 앞에 과정 모두 로드 한후 실행, DOM은 관련 로직만 실행되면 바로 실행
    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (yOffset > 0) {
        let siId = setInterval(() => {
            window.scrollTo(0, tempYOffset);
            tempYOffset += 5;

            if(tempScrollCount > 20) {
                clearInterval(siId);
            }
            tempScrollCount++;
        }, 20);
    }

        window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
        checkMenu();

        if (!rafState) {
            rafId = requestAnimationFrame(loop);
            rafState = true;
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            setLayout();
            sceneInfo[3].values.rectStartY = 0;
        }

        if (currentScene === 3 && window.innerWidth > 450) {
            let tempYOffset = yOffset;
            let tempScrollCount = 0;
            if (yOffset > 0) {
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset -= 50;

                if(tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
          }
        }
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(setLayout, 200);
    });

    // this는 전역객체를 가리키기 때문에 사용 불가
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
        document.body.removeChild(e.currentTarget);
        });
    });

    setCanvasImages();

})();
