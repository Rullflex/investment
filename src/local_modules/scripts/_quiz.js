import $ from 'jquery'
export default function quiz() {
    //конфигурационные переменные
    const progressTextFinal = 'Завершено!';
    const autoMoveDelay = 150;
    const fadeDuration = 350;

    //переменные для работы
    let currentSlide = 0;
    let numberOfSlides = $(".form__items-wrap > .form__item").length;
    let finalSlide = numberOfSlides - 1;
    let progressCoef = 100 / (numberOfSlides - 1);

    let progressPerSlide = [0, 0, 0, 0]
    
    let json = ``    
    $.getJSON("data.json").done(function(data) {
        json = data
        initParams()
    })

    function initParams() {
        // 1 slide
        let tempMarkUp = ``
        Object.keys(json[Object.keys(json)[1]]).map((el) => {
            if (el !== '' && el !== 'time') {
                tempMarkUp += `
                <div class="option quiz-click-automove">
                    <span>${el}</span>
                    <input class="d-none" type="radio" name="Сколько сотрудников" value="${el}">
                </div>
                `
            }
        })
        $('.quiz .form__item:eq(0) .options').html(tempMarkUp)
        tempMarkUp = ``

        // 2 slide
        Object.keys(json).map((el) => {
            if (el !== '' && el !== 'types' && el !== 'fast' && el !== 'urgent') {
                tempMarkUp += `
                <div class="option quiz-click-automove">
                    <span>${el}</span>
                    <input class="d-none" type="radio" name="Адрес" value="${el}">
                </div>
                `
            }
        })
        $('.quiz .form__item:eq(1) .options').html(tempMarkUp)
        tempMarkUp = ``

        //4 slide
        json.types.map((el) => {
            if (el !== '' && el !== 'types' && el !== 'fast' && el !== 'urgent') {
                tempMarkUp += `
                <div class="option quiz-click-automove">
                    <span>${el}</span>
                    <input class="d-none" type="radio" name="Метод" value="${el}">
                </div>
                `
            }
        })
        tempMarkUp += `
                <div class="option quiz-click-automove">
                    <span>Не знаю</span>
                    <input class="d-none" type="radio" name="Метод" value="Не знаю">
                </div>
                `
        $('.quiz .form__item:eq(3) .options').html(tempMarkUp)
        tempMarkUp = ``
        quizAdaptiveHeights()
    }


    $('.form__items-wrap').css({
        'width': (numberOfSlides * 100) + '%',
        'visibility': 'visible'
    });
    $('.quiz-text-changable').each(function(){
        let t = $(this).data('text-s' + (currentSlide + 1));
        $(this).html(t);
    });
    $('.gifts__item').each(function(){
        let s = $(this).data('when-to-show');
        if (+s <= (currentSlide + 1)) {
            $(this).find('.gifts__img--before').hide();
            $(this).find('.gifts__img--after').fadeIn(fadeDuration);
            $(this).find('.gifts__descr--before').hide();
            $(this).find('.gifts__descr--after').fadeIn(fadeDuration);
        }
    });

    //клики по кнопкам
    $('.quiz__btn-prev').on('click', function() {
        currentSlide--;
        $('.quiz__btn-next').attr('disabled', true);
        qСhange();
    });
    $('.quiz__btn-next').on('click', function() {
        currentSlide++;
        $('.quiz__btn-prev').attr('disabled', false);
        $('.quiz__btn-next').attr('disabled', true);
        qСhange();
    });
    //классы-действия
    $('.quiz').on('click', '.quiz-click-automove', function() {
        $('.quiz__btn-next').attr('disabled', false);
        setTimeout(function(){
            $('.quiz__btn-next').trigger('click');
        }, autoMoveDelay);
        
    });
    $('.quiz-letgo-click').on('click', function() {
        const target = $(this);
        const formItem = target.closest('.form__item');
        target.toggleClass('quiz-click-active');
        if (formItem.find('.quiz-letgo-click').hasClass('quiz-click-active')) {
            $('.quiz__btn-next').attr('disabled', false);  
        } else {
            $('.quiz__btn-next').attr('disabled', true);  
        }
        if (target.hasClass('check')) {
            const objOfChecks = target.closest('.form__item').find('.check');
            let value = '';
            for (let i = 0; i < objOfChecks.length; i++) {
                const e = objOfChecks[i];
                if(e.classList.contains('quiz-click-active')) {
                    e.childNodes.forEach((el, i) => {
                        if (el.nodeName == 'INPUT') {
                            value += el.dataset.value + ' + ';
                        }
                    });
                }
            }
            for (let i = 0; i < objOfChecks.length; i++) {
                const e = objOfChecks[i];
                e.childNodes.forEach((el, i) => {
                    if (el.nodeName == 'INPUT') {
                        el.value = value;
                    }
                });
            }
        }
    });
    document.querySelectorAll('.quiz-letgo-noempty').forEach(item => {
        item.addEventListener('input', (e) => {
            if (e.target.value != '') {
                $('.quiz__btn-next').attr('disabled', false); 
            } else {
                $('.quiz__btn-next').attr('disabled', true);
            }

        });
    });

    quizAdaptiveHeights()
    
    function quizAdaptiveHeights() {
        if (currentSlide === finalSlide) {
            let num = $(`.quiz .form__item:eq(${currentSlide}) .item`).length - 1

            if ($(window).width() < 768) {
                let deltaHeight = 0
                $(`.quiz .form__item:eq(${currentSlide}) .item`).each(function() {
                    deltaHeight += $(this).outerHeight(true) 
                })
                $('.quiz').css('height', `${510 + deltaHeight}px`);
            } else if ($(window).width() < 1170) {
                let deltaHeight = 0
                $(`.quiz .form__item:eq(${currentSlide}) .item`).each(function() {
                    deltaHeight += $(this).outerHeight(true) 
                })
                $('.quiz').css('height', `${525 + deltaHeight}px`);
            } else {
                let deltaHeight = 0
                $(`.quiz .form__item:eq(${currentSlide}) .item`).each(function(idx) {
                    if (idx % 2 === 0) {
                        deltaHeight += $(this).outerHeight(true) 
                    }
                    
                })
                $('.quiz').css('height', `${390 + deltaHeight}px`);
                
            }
        } else {
            let num = $(`.quiz .form__item:eq(${currentSlide}) .option`).length
            if ($(window).width() < 768) {
                if (num >= 5) {
                    $('.quiz').css('height', `${637 + (90 * (num - 4))}px`);
                } else {
                    $('.quiz').css('height', `637px`);
                }
            } else if ($(window).width() < 1170) {
                if (num >= 7) {
                    $('.quiz').css('height', `${808 + (100 * (num - 7))}px`);
                } else {
                    $('.quiz').css('height', `808px`);
                }
            } else {
                if (num >= 7) {
                    $('.quiz').css('height', `${622 + (100 * (num - 7))}px`);
                } else {
                    $('.quiz').css('height', `622px`);
                }
            }
        }
    }
    function qСhange() {
        let currentPersent = currentSlide * Math.round(progressCoef);
        $('.quiz__progress-number').hide().html((currentSlide + 1)).fadeIn(fadeDuration);
        $('.quiz__progress-persent').hide().html(currentPersent).fadeIn(fadeDuration);
        
        $('.quiz-text-changable').each(function(){
            let t = $(this).data('text-s' + (currentSlide + 1));
            $(this).hide().html(t).fadeIn(fadeDuration);        
        });

        $('.gifts__item').each(function(){
            let s = $(this).data('when-to-show');
            if (+s <= (currentSlide + 1)) {
                $(this).find('.gifts__img--before').hide();
                $(this).find('.gifts__img--after').fadeIn(fadeDuration);
                $(this).find('.gifts__descr--before').hide();
                $(this).find('.gifts__descr--after').fadeIn(fadeDuration);
            } else {
                $(this).find('.gifts__img--after').hide();
                $(this).find('.gifts__img--before').fadeIn(fadeDuration);
                $(this).find('.gifts__descr--after').hide();
                $(this).find('.gifts__descr--before').fadeIn(fadeDuration);
            }
        });
        
        // Писать код для каждого отдельного слайда здесь!

        //первый слайд
        if (currentSlide === 0) {
            $('.quiz__btn-prev').attr('disabled', true);
        }
        if (currentSlide === 1) {
            if (progressPerSlide[0] === 0) {
                progressPerSlide[0] = 1
                ym(27364925,'reachGoal','form1')
            }
        }
        if (currentSlide === 2) {
            if (progressPerSlide[1] === 0) {
                progressPerSlide[1] = 1
                ym(27364925,'reachGoal','form2')
            }
        }
        if (currentSlide === 3) {
            if (progressPerSlide[2] === 0) {
                progressPerSlide[2] = 1
                ym(27364925,'reachGoal','form3')
            }
        }
        // финальный слайд
        if (currentSlide === finalSlide) {
            if (progressPerSlide[3] === 0) {
                progressPerSlide[3] = 1
                ym(27364925,'reachGoal','form4')

            }
            $('.quiz-remove-end').css('display','none');
            $('.quiz-invisible-end').css({
                'opacity': 0,
                'visibility': 'hidden'
            });
            $('.quiz__progress-text').hide().html(progressTextFinal).fadeIn(fadeDuration);
            
            $('.quiz .form__item:last').css('overflow', 'visible');
            $('.quiz .quiz__form').css('overflow', 'visible');
            $('.quiz .form__item:not(.form__item:last)').css('visibility', 'hidden');

            // подсчет всего говна
            const quantity = $('.quiz .form__item:eq(0)').find('.option.active span').text()
            const location = $('.quiz .form__item:eq(1)').find('.option.active span').text()
            const period = $('.quiz .form__item:eq(2)').find('.option.active span').text()
            const type = $('.quiz .form__item:eq(3)').find('.option.active span').text()
            if (json.types.some((el) => el === type)) {
                let tempMarkUp = ``
                json.types.map((el, i) => {
                    if (el === type) {
                        if (json[location][quantity][i * 3] !== '' && json[location].time[i * 3] !== '') {
                            tempMarkUp += `
                            <div class="item">
                                <div class="title">
                                    <span>Тест ${json.types[i]}</span>
                                </div>
                                <div class="cost">
                                    <b>${json[location][quantity][i * 3]}</b>
                                </div>
                                <div class="time">
                                    <b>${json[location].time[i * 3]},</b> не включая день забора
                                </div>
                            </div>
                            `
                        }
                        if (json.fast[i] !== '') {
                            if (json[location][quantity][i * 3 + 1] !== '' && json[location].time[i * 3 + 1] !== '') {
                                tempMarkUp += `
                                <div class="item">
                                    <div class="title">
                                        <span>Тест ${json.types[i]}</span>
                                        <div class="badge">${json.fast[i]}</div>
                                    </div>
                                    <div class="cost">
                                        <b>${json[location][quantity][i * 3 + 1]}</b>
                                    </div>
                                    <div class="time">
                                        <b>${json[location].time[i * 3 + 1]},</b> не включая день забора
                                    </div>
                                </div>
                                `
                            }
                        }
                        if (json.urgent[i] !== '') {
                            if (json[location][quantity][i * 3 + 2] !== '' && json[location].time[i * 3 + 2] !== '') {
                                tempMarkUp += `
                                <div class="item">
                                    <div class="title">
                                        <span>Тест ${json.types[i]}</span>
                                        <div class="badge">${json.urgent[i]}</div>
                                    </div>
                                    <div class="cost">
                                        <b>${json[location][quantity][i * 3 + 2]}</b>
                                    </div>
                                    <div class="time">
                                        <b>${json[location].time[i * 3 + 2]},</b> не включая день забора
                                    </div>
                                </div>
                                `
                            }
                            
                        }
                    }
                })
                
                $('.quiz .form__item:eq(4) .results').html(tempMarkUp)
            } else {
                let counter = 1,
                    tempMarkUp = ``
                
                json.types.map((el, i) => {
                    if (el !== '' && counter <= 3) {
                        if (json[location][quantity][i * 3] !== '' && json[location].time[i * 3] !== '') {
                            tempMarkUp += `
                            <div class="item">
                                <div class="title">
                                    <span>Тест ${json.types[i]}</span>
                                </div>
                                <div class="cost">
                                    <b>${json[location][quantity][i * 3]}</b>
                                </div>
                                <div class="time">
                                    <b>${json[location].time[i * 3]},</b> не включая день забора
                                </div>
                            </div>
                            `
                        }
                        if (json.fast[i] !== '') {
                            if (json[location][quantity][i * 3 + 1] !== '' && json[location].time[i * 3 + 1] !== '') {
                                tempMarkUp += `
                                <div class="item">
                                    <div class="title">
                                        <span>Тест ${json.types[i]}</span>
                                        <div class="badge">${json.fast[i]}</div>
                                    </div>
                                    <div class="cost">
                                        <b>${json[location][quantity][i * 3 + 1]}</b>
                                    </div>
                                    <div class="time">
                                        <b>${json[location].time[i * 3 + 1]},</b> не включая день забора
                                    </div>
                                </div>
                                `
                            }
                        }
                        if (json.urgent[i] !== '') {
                            if (json[location][quantity][i * 3 + 2] !== '' && json[location].time[i * 3 + 2] !== '') {
                                tempMarkUp += `
                                <div class="item">
                                    <div class="title">
                                        <span>Тест ${json.types[i]}</span>
                                        <div class="badge">${json.urgent[i]}</div>
                                    </div>
                                    <div class="cost">
                                        <b>${json[location][quantity][i * 3 + 2]}</b>
                                    </div>
                                    <div class="time">
                                        <b>${json[location].time[i * 3 + 2]},</b> не включая день забора
                                    </div>
                                </div>
                                `
                            }
                            
                        }
                        counter += 2
                    }
                })
                $('.quiz .form__item:eq(4) .results').html(tempMarkUp)
            }
            
            
            // console.log(`quantity: ${quantity}, location: ${location}, price: ${json[location][quantity]}`)

            $('.quiz__form .btn').on('click', function() {
                $('.hidden-inputs').html(`
                    <input type="hidden" name="Кол-во сотрудников" value="${quantity}">
                    <input type="hidden" name="Расстояние" value="${location}">
                    <input type="hidden" name="Как часто" value="${period}">
                    <input type="hidden" name="Метод" value="${type}">
                `)
            })

        }
        quizAdaptiveHeights()
        $('.quiz .form__item').css('transform','translateX('+ (currentSlide * -100) +'%)');
        $('.quiz__progress-line').css('width', (currentSlide * progressCoef) + '%');
    }
    document.querySelectorAll('.quiz form').forEach(item => {
        item.addEventListener('keydown', (e) => {
            if (e.keyCode == 9) {
                e.preventDefault();
            }

        });
    });
}



