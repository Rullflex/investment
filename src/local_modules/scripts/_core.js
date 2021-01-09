import IMask from 'imask'
import UIkit from 'uikit'

class App {
    constructor() {
        this.isMobile = {
            Android: () => navigator.userAgent.match(/Android/i),
            BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
            iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
            Opera: () => navigator.userAgent.match(/Opera Mini/i),
            Windows: () => navigator.userAgent.match(/IEMobile/i),
            any: () => (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows())
        }
        this.sliderControl = `<span class="svg-icon svg-icon--arrow-control"><svg><use xlink:href="#arrow-control"></use></svg></span>`
        
        this.md = 768
        this.lg = 1210
    }

    init() {
        if (this.isMobile.any()) {}

        if (!this.isMobile.any()) {}
    }

    // plural(number, ['год', 'года', 'лет'])
    plural(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2]
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    }

    accordionSlider({
        selector = `.accordion-slider`,
        onInit = () => {},
        onSlide = () => {},
        onSlideNext = () => {},
        onSlidePrev = () => {}
    } = {}) {
        UIkit.slider(selector, {
            draggable: true,
            finite: true,
            velocity: 0.3
        })
        document.querySelectorAll(`${selector} .uk-slider-items > li`).forEach((el, idx) => {

            el.addEventListener(`beforeitemshow`, (event) => {
                const target = event.target
                target.parentNode.childNodes.forEach( el => el.classList.remove(`active`))
                target.classList.add(`active`)
                const prev = event.target.previousSibling
                if (prev !== null) {
                    if (prev.classList.contains(`uk-active`)) {
                        // вперед
                        prev.classList.add(`invisible`)
                        onSlideNext()
                    } else {
                        // назад
                        target.classList.remove(`invisible`)
                        onSlidePrev()
                    }
                } else {
                    target.classList.remove(`invisible`)
                    onSlidePrev()
                }
                onSlide()
            })
        })
        onInit()
    }

    tabSwitcher({
        parent = ``,
        onInit = () => {}
    } = {}) {
        const tabNav = `${parent} .tab-switcher`,
              items = `${parent} .uk-switcher-items`,
              switcher = `${parent} .uk-switcher`

        UIkit.slider(tabNav, {
            finite: true
        })
        UIkit.switcher(items, {
            connect: switcher,
            animation: `uk-animation-slide-left-medium, uk-animation-slide-right-medium`
        });

        document.querySelector(`${tabNav} .uk-slider-items li`).classList.add(`active`)

        document.querySelectorAll(`${tabNav} .uk-slider-items li`).forEach((el) => {
            el.addEventListener(`click`, (event) => {
                const target = event.currentTarget
                if (!target.classList.contains(`active`)) {
                    
                    document.querySelectorAll(`${tabNav} .uk-slider-items li`).forEach((el, index) => {
                        el.classList.remove(`active`)
                        if (el === target) {
                            UIkit.switcher(items).show(index)
                        }
                    })

                    target.classList.add(`active`)
                }
            })
        })

        onInit()
    }

    tabSlider({
        parent = ``,
        onInit = () => {}
    } = {}) {
        const tabNav = `${parent} .tab-switcher`,
              slider = `${parent} .tab-slider`

        UIkit.slider(tabNav, {
            finite: true
        })

        UIkit.slider(slider, {
            finite: true
        })

        document.querySelector(`${tabNav} .uk-slider-items li`).classList.add(`active`)

        document.querySelectorAll(`${tabNav} .uk-slider-items li`).forEach((el) => {
            el.addEventListener(`click`, (event) => {
                const target = event.currentTarget
                if (!target.classList.contains(`active`)) {
                    
                    document.querySelectorAll(`${tabNav} .uk-slider-items li`).forEach((el, index) => {
                        // el.classList.remove(`active`)
                        if (el === target) {
                            UIkit.slider(slider).show(index)
                        }
                    })

                    // target.classList.add(`active`)
                }
            })
        })

        document.querySelectorAll(`${slider} .uk-slider-items > li`).forEach((el, idx) => {

            el.addEventListener(`beforeitemshow`, (event) => {
                const target = event.target
                const prev = event.target.previousSibling

                target.parentNode.childNodes.forEach( el => el.classList.remove(`active`))
                target.classList.add(`active`)

                
                

                const showTabNav = (index) => {
                    document.querySelectorAll(`${tabNav} .uk-slider-items li`).forEach((el, idx) => {
                        if (idx === index) {
                            el.classList.add(`active`)
                            // UIkit.slider(tabNav).show(index)
                        } else {
                            el.classList.remove(`active`)
                        }
                    })
                }

                showTabNav([...target.parentElement.children].indexOf(target))

                if (prev !== null) {
                    if (prev.classList.contains(`uk-active`)) {
                        // вперед
                        prev.classList.add(`invisible`)
                    } else {
                        // назад
                        target.classList.remove(`invisible`)
                    }
                } else {
                    target.classList.remove(`invisible`)
                }
            })
        })

        onInit()
    }

    accordion({
        selector = `.accordion`
    } = {}) {

        UIkit.accordion(selector, {
            transition: 'ease-in-out',
            duration: 300
        })
    }

    matchMediaListener(breakpoint, callbackLessThan, callbackBiggerThan) {
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`)
        function handleBreakpointCross(e) {
            // Check if the media query is true
            if (e.matches) {
                callbackBiggerThan()
            } else {
                callbackLessThan()
            }
        }
        // Register event listener
        mediaQuery.addListener(handleBreakpointCross)

        // Initial check
        handleBreakpointCross(mediaQuery)
    }

}

class Quiz extends App{
    constructor({
        selector,
        autoMoveDelay = 150,
        activeClass = `quiz-active`
    } = {}) {
        super()
        this.selector = selector
        this.autoMoveDelay = autoMoveDelay
        this.activeClass = activeClass

        this.currentSlide = 0

        this.setOfSlides = document.querySelectorAll(`${selector} .quiz-slide`)
        this.numberOfSlides = this.setOfSlides.length
        this.lastIndex = this.numberOfSlides - 1
        this.quiz = document.querySelector(this.selector)

    }

    create () {
        this.refreshValues()

        this.quiz.addEventListener(`click`, (e) => {
            const target = e.target

            if (target.classList.contains(`quiz-radio`)) {
                target.closest(`.quiz-radio-wrap`).querySelectorAll(`.quiz-radio`).forEach(e => e.classList.remove(this.activeClass))
                target.classList.add(this.activeClass)
                setTimeout( () => this.toNextSlide(), this.autoMoveDelay);
            } else {
                
            }
        })

        
        
    }

    refreshValues() {
        this.quiz.querySelector(`.quiz-progress-bar`).style.cssText = `width: ${100 / (this.numberOfSlides - 1) * this.currentSlide}%`
        this.quiz.querySelector(`.quiz-progress-num`).innerText = this.currentSlide + 1

        if (this.currentSlide === this.lastIndex) {
            // финальный слайд
            this.onFinalSlideShow()
            this.quiz.querySelectorAll(`.quiz-final-hide`).forEach(el => el.classList.add(`hidden`))
            this.quiz.querySelectorAll(`.quiz-final-show`).forEach(el => el.classList.remove(`hidden`))

            if (window.innerWidth < this.lg) {
                //изменение высот
                this.quiz.querySelector(`.quiz-slide-wrap`).style.cssText = `height: 27rem`
            }
            
        } else {
            // остальные слайды
            this.quiz.querySelectorAll(`.quiz-final-hide`).forEach(el => el.classList.remove(`hidden`))
            this.quiz.querySelectorAll(`.quiz-final-show`).forEach(el => el.classList.add(`hidden`))

            if (window.innerWidth < this.lg) {
                //изменение высот
                this.quiz.querySelector(`.quiz-slide-wrap`).style.cssText = `
                height: ${this.quiz.querySelector(`.quiz-slide.${this.activeClass} .quiz-radio-wrap`).clientHeight + this.quiz.querySelector(`.quiz-slide.${this.activeClass} h3`).clientHeight + 30}px`
            }
            
        }
        
    }

    toNextSlide() {
        if (this.currentSlide < this.lastIndex) {
            this.toSlide(this.currentSlide + 1)
        } else {
            console.error(`Error in Quiz.toNextSlide(): last slide cannot be passed`)
        }
        
    }

    toPrevSlide() {
        if (this.currentSlide > 0) {
            this.toSlide(this.currentSlide - 1)
        } else {
            console.error(`Error in Quiz.toPrevSlide(): first slide cannot be passed`)
        }
    }

    toSlide(position) {
        if (position >= 0 && position <= this.lastIndex) {
            this.setOfSlides[this.currentSlide].classList.remove(this.activeClass)
            this.currentSlide = position
            this.setOfSlides[this.currentSlide].classList.add(this.activeClass)

            this.refreshValues()
        } else {
            console.error(`Error in Quiz.toSlide(): position is invalid`)
        }
    }

    onFinalSlideShow() {
        this.quiz.querySelector(`form .values`).innerHTML = ``
        this.quiz.querySelectorAll(`.quiz-slide`).forEach((el) => {
            let list = []
            el.querySelectorAll(`.${this.activeClass}`).forEach(e => list.push(e.getAttribute("data-value")))
            this.quiz.querySelector(`form .values`).insertAdjacentHTML('beforeend', `<input type="hidden" name="${el.getAttribute(`data-title`)}" value="${list.join(`, `)}">`)
        })
        
    }

    reset() {
        this.toSlide(0)
    }


}

class Form extends App {
    constructor() {
        super()
    }

    init({
        disableIMask = false
    } = {}) {
        disableIMask || this.phoneMask()
        // this.check()
        // this.option()
    }


    phoneMask() {
        $.each($(`input.phone`), (index, e) => {
            $(e.target).attr(`type`, `tel`)
            $(e.target).on(`focus`, (event) => {
                $(event.target).addClass(`focus`)
                $(event.target).parent().addClass(`focus`)
                $(event.target).parent().removeClass(`err`)
                $(event.target).removeClass(`err`)
            })
        })
        let mask
        document.querySelectorAll(`input.phone`).forEach((e) => {
            e.addEventListener(`focusin`, () => {
                mask = IMask(
                    e, {
                        mask: `+7 (000) 000-00-00`,
                        startsWith: `7`,
                        lazy: false,
                        country: `Russia`
                    })
            })
            e.addEventListener(`focusout`, () => {
                if (mask.value.match(/_/g) != null) {
                    e.value = null
                    e.parentElement.classList.remove(`complete`)
                } else {
                    e.parentElement.classList.add(`complete`)
                }
                mask.destroy()
                e.classList.remove(`focus`)
                e.parentElement.classList.remove(`focus`)
            })
        })
    }


    // check() {
    //     $.each($(`.check`), function (index, e) {
    //         if ($(e.target).find(`input`).prop(`checked`) === true) {
    //             $(e.target).addClass(`active`)
    //         }
    //     })
    //     $(`body`).off(`click`, `.check`, function () {})
    //     $(`body`).on(`click`, `.check`, function (event) {
    //         if (!$(event.target).hasClass(`disable`)) {
    //             const target = $(event.target)
    //             if (!target.is(`a`)) {
    //                 $(event.target).toggleClass(`active`)
    //                 if ($(event.target).hasClass(`active`)) {
    //                     $(event.target).find(`input`).prop(`checked`, true)
    //                 } else {
    //                     $(event.target).find(`input`).prop(`checked`, false)
    //                 }
    //             }
    //         }
    //     })
    // }

    // option() {
    //     $.each($(`.option.active`), (index, el) => {
    //         $(el.currentTarget).find(`input`).prop(`checked`, true)
    //     })
    //     $(`.option`).on(`click`, (event) => {
    //         if (!$(event.currentTarget).hasClass(`disable`)) {
    //             const target = $(event.currentTarget)
    //             if (!target.is(`a`)) {
    //                 if ($(event.currentTarget).hasClass(`active`) && $(event.currentTarget).hasClass(`order`)) {
    //                     $(event.currentTarget).toggleClass(`orderactive`)
    //                 }
    //                 $(event.currentTarget).parents(`.options`).find(`.option`).removeClass(`active`)
    //                 $(event.currentTarget).toggleClass(`active`)
    //                 $(event.currentTarget).children(`input`).prop(`checked`, true)
    //             }
    //         }
    //     })
    // }
    initValidation() {
        document.querySelectorAll(`form`).forEach(el => el.addEventListener(`submit`, (event) => {
            event.preventDefault()
            const form = event.currentTarget
            let errors = 0
            form.querySelectorAll(`.req`).forEach(e => errors += this.formValidate(e))

            if (errors === 0) {
                this.removeFormError(form)
            } else {
                
            }
        }))
    }

    formValidate(input) {
        let er = 0
        const form = input.parents(`form`)

        if (input.attr(`name`) === `email` || input.hasClass(`email`)) {
            if (input.val() !== input.attr(`data-value`)) {
                const em = input.val().replace(` `, ``)
                input.val(em)
            }
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.val())) || input.val() === input.attr(`data-value`)) {
                er++
                addError(input)
            } else {
                removeError(input)
            }
        } else {
            if (input.val() === `` || input.val() === input.attr(`data-value`)) {
                er++
                addError(input)
            } else {
                removeError(input)
            }
        }

        if (input.attr(`type`) === `checkbox`) {
            if (input.prop(`checked`) === true) {
                input.removeClass(`err`).parent().removeClass(`err`)
            } else {
                er++
                input.addClass(`err`).parent().addClass(`err`)
            }
        }

        if (input.hasClass(`name`)) {
            if (!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))) {
                er++
                addError(input)
            }
        }

        if (input.hasClass(`pass-2`)) {
            if (form.find(`.pass-1`).val() !== form.find(`.pass-2`).val()) {
                addError(input)
            } else {
                removeError(input)
            }
        }
        return er
    }
}


export { App, Quiz, Form }
