(function() {
    'use strict';

    window.__app = window.__app || {};
    if (window.__app.initialized) return;

    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() { inThrottle = false; }, limit);
            }
        };
    }

    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function initBurgerMenu() {
        if (window.__app.burgerInit) return;
        window.__app.burgerInit = true;

        var toggle = document.querySelector('.navbar-toggler, .c-nav__toggle');
        var collapse = document.querySelector('.navbar-collapse, #navbarNav');
        var body = document.body;

        if (!toggle || !collapse) return;

        var isOpen = false;

        function openMenu() {
            isOpen = true;
            collapse.classList.add('show');
            collapse.style.height = 'calc(100vh - var(--header-h))';
            toggle.setAttribute('aria-expanded', 'true');
            body.classList.add('u-no-scroll');
        }

        function closeMenu() {
            isOpen = false;
            collapse.classList.remove('show');
            collapse.style.height = '';
            toggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('u-no-scroll');
        }

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        document.addEventListener('click', function(e) {
            if (isOpen && !collapse.contains(e.target) && !toggle.contains(e.target)) {
                closeMenu();
            }
        });

        var navLinks = collapse.querySelectorAll('.nav-link, .c-nav__item');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                closeMenu();
            });
        }

        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth >= 1024 && isOpen) {
                closeMenu();
            }
        }, 100));
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInit) return;
        window.__app.scrollSpyInit = true;

        var sections = document.querySelectorAll('[id]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"], .c-nav__item[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInit) return;
        window.__app.smoothScrollInit = true;

        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;

            var href = link.getAttribute('href');
            if (href === '#' || href === '#!') return;

            var targetId = href.substring(1);
            var target = document.getElementById(targetId);
            if (!target) return;

            e.preventDefault();

            var header = document.querySelector('.l-header, header');
            var offset = header ? header.offsetHeight : 80;
            var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    }

    function initScrollAnimations() {
        if (window.__app.scrollAnimInit) return;
        window.__app.scrollAnimInit = true;

        var animatedElements = document.querySelectorAll('.card, .c-card, img, .btn, h1, h2, h3, p');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    function initMicroInteractions() {
        if (window.__app.microInit) return;
        window.__app.microInit = true;

        var interactiveElements = document.querySelectorAll('.btn, .c-button, .card, .c-card, .nav-link, .c-nav__item, a');

        interactiveElements.forEach(function(el) {
            el.style.transition = 'all 0.3s ease-in-out';

            el.addEventListener('mouseenter', function() {
                if (this.classList.contains('btn') || this.classList.contains('c-button')) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                    this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                } else if (this.classList.contains('card') || this.classList.contains('c-card')) {
                    this.style.transform = 'translateY(-6px)';
                    this.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.18)';
                } else {
                    this.style.transform = 'scale(1.05)';
                }
            });

            el.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });

            el.addEventListener('mousedown', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                var style = document.createElement('style');
                if (!document.getElementById('ripple-animation')) {
                    style.id = 'ripple-animation';
                    style.innerHTML = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
                    document.head.appendChild(style);
                }

                var container = this;
                if (getComputedStyle(this).position === 'static') {
                    this.style.position = 'relative';
                }
                this.style.overflow = 'hidden';

                this.appendChild(ripple);

                setTimeout(function() {
                    if (ripple.parentNode === container) {
                        container.removeChild(ripple);
                    }
                }, 600);
            });
        });
    }

    function initCountUp() {
        if (window.__app.countUpInit) return;
        window.__app.countUpInit = true;

        var counters = document.querySelectorAll('[data-count]');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = entry.target;
                    var targetNumber = parseInt(target.getAttribute('data-count')) || 0;
                    var duration = 2000;
                    var startTime = null;

                    function animate(currentTime) {
                        if (!startTime) startTime = currentTime;
                        var progress = Math.min((currentTime - startTime) / duration, 1);
                        var easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                        var currentNumber = Math.floor(easeProgress * targetNumber);

                        target.textContent = currentNumber.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            target.textContent = targetNumber.toLocaleString();
                        }
                    }

                    requestAnimationFrame(animate);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    function initFormValidation() {
        if (window.__app.formValidationInit) return;
        window.__app.formValidationInit = true;

        var notificationContainer = document.createElement('div');
        notificationContainer.className = 'position-fixed top-0 end-0 p-3';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);

        function showNotification(message, type) {
            type = type || 'info';
            var alertClass = 'alert-' + (type === 'error' ? 'danger' : type);

            var alert = document.createElement('div');
            alert.className = 'alert ' + alertClass + ' alert-dismissible fade show';
            alert.style.animation = 'slideInRight 0.5s ease-out';
            alert.innerHTML = escapeHtml(message) + '<button type="button" class="btn-close" aria-label="Close"></button>';

            var closeBtn = alert.querySelector('.btn-close');
            closeBtn.addEventListener('click', function() {
                alert.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(function() {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            });

            notificationContainer.appendChild(alert);

            setTimeout(function() {
                if (alert.parentNode) {
                    alert.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(function() {
                        if (alert.parentNode) {
                            alert.parentNode.removeChild(alert);
                        }
                    }, 300);
                }
            }, 5000);
        }

        var animationStyle = document.createElement('style');
        animationStyle.innerHTML = '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
        document.head.appendChild(animationStyle);

        function validateField(field) {
            var value = field.value.trim();
            var type = field.type;
            var name = field.name;
            var errorElement = field.parentElement.querySelector('.invalid-feedback');
            var isValid = true;
            var errorMessage = '';

            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'invalid-feedback';
                field.parentElement.appendChild(errorElement);
            }

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'Dieses Feld ist erforderlich.';
            } else if (value) {
                if (type === 'email' || name === 'email') {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                    }
                } else if (type === 'tel' || name === 'phone') {
                    var phoneRegex = /^[\d\s\+\(\)\-]{10,20}$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein (10-20 Zeichen, nur Ziffern und +()-).';
                    }
                } else if (name === 'firstName' || name === 'lastName') {
                    var nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
                    if (!nameRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie einen gültigen Namen ein (2-50 Zeichen, nur Buchstaben).';
                    }
                } else if (name === 'message') {
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Die Nachricht muss mindestens 10 Zeichen lang sein.';
                    }
                }
            }

            if (field.type === 'checkbox' && field.hasAttribute('required')) {
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Bitte akzeptieren Sie die Datenschutzerklärung.';
                }
            }

            if (isValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }

            return isValid;
        }

        var forms = document.querySelectorAll('.needs-validation, form');
        forms.forEach(function(form) {
            var fields = form.querySelectorAll('input, textarea, select');

            fields.forEach(function(field) {
                field.addEventListener('blur', function() {
                    validateField(field);
                });

                field.addEventListener('input', debounce(function() {
                    if (field.classList.contains('is-invalid')) {
                        validateField(field);
                    }
                }, 300));
            });

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var isFormValid = true;
                fields.forEach(function(field) {
                    if (!validateField(field)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    showNotification('Bitte korrigieren Sie die Fehler im Formular.', 'error');
                    var firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                var submitBtn = form.querySelector('[type="submit"]');
                var originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Wird gesendet...';

                setTimeout(function() {
                    showNotification('Ihre Nachricht wurde erfolgreich gesendet!', 'success');
                    
                    setTimeout(function() {
                        window.location.href = 'thank_you.html';
                    }, 1500);
                }, 1000);
            });
        });
    }

    function initModalHandlers() {
        if (window.__app.modalInit) return;
        window.__app.modalInit = true;

        var modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');

        modalTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                var targetId = this.getAttribute('data-bs-target');
                var modal = document.querySelector(targetId);

                if (modal) {
                    modal.classList.add('show');
                    modal.style.display = 'flex';
                    modal.style.animation = 'fadeIn 0.3s ease-out';
                    document.body.style.overflow = 'hidden';

                    var backdrop = document.createElement('div');
                    backdrop.className = 'modal-backdrop';
                    backdrop.style.position = 'fixed';
                    backdrop.style.top = '0';
                    backdrop.style.left = '0';
                    backdrop.style.width = '100%';
                    backdrop.style.height = '100%';
                    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    backdrop.style.zIndex = '1099';
                    backdrop.style.animation = 'fadeIn 0.3s ease-out';
                    document.body.appendChild(backdrop);

                    function closeModal() {
                        modal.style.animation = 'fadeOut 0.3s ease-in';
                        backdrop.style.animation = 'fadeOut 0.3s ease-in';

                        setTimeout(function() {
                            modal.classList.remove('show');
                            modal.style.display = 'none';
                            document.body.style.overflow = '';
                            if (backdrop.parentNode) {
                                backdrop.parentNode.removeChild(backdrop);
                            }
                        }, 300);
                    }

                    var closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"], .btn-close');
                    closeButtons.forEach(function(btn) {
                        btn.addEventListener('click', closeModal);
                    });

                    backdrop.addEventListener('click', closeModal);

                    document.addEventListener('keydown', function escapeHandler(e) {
                        if (e.key === 'Escape') {
                            closeModal();
                            document.removeEventListener('keydown', escapeHandler);
                        }
                    });
                }
            });
        });

        var fadeStyle = document.createElement('style');
        fadeStyle.innerHTML = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }';
        document.head.appendChild(fadeStyle);
    }

    function initScrollToTop() {
        if (window.__app.scrollToTopInit) return;
        window.__app.scrollToTopInit = true;

        var scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.style.position = 'fixed';
        scrollBtn.style.bottom = '20px';
        scrollBtn.style.right = '20px';
        scrollBtn.style.width = '50px';
        scrollBtn.style.height = '50px';
        scrollBtn.style.borderRadius = '50%';
        scrollBtn.style.backgroundColor = 'var(--color-primary)';
        scrollBtn.style.color = 'var(--color-white)';
        scrollBtn.style.border = 'none';
        scrollBtn.style.fontSize = '24px';
        scrollBtn.style.cursor = 'pointer';
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
        scrollBtn.style.transition = 'all 0.3s ease-in-out';
        scrollBtn.style.zIndex = '1000';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');

        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }, 100));

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
    }

    function initAccordions() {
        if (window.__app.accordionInit) return;
        window.__app.accordionInit = true;

        var accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var target = this.getAttribute('data-bs-target');
                var collapse = document.querySelector(target);

                if (!collapse) return;

                var isExpanded = this.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    this.classList.add('collapsed');
                    this.setAttribute('aria-expanded', 'false');
                    collapse.style.height = collapse.scrollHeight + 'px';
                    setTimeout(function() {
                        collapse.style.height = '0';
                    }, 10);
                    collapse.classList.remove('show');
                } else {
                    this.classList.remove('collapsed');
                    this.setAttribute('aria-expanded', 'true');
                    collapse.classList.add('show');
                    collapse.style.height = collapse.scrollHeight + 'px';

                    collapse.addEventListener('transitionend', function handler() {
                        collapse.style.height = 'auto';
                        collapse.removeEventListener('transitionend', handler);
                    });
                }
            });
        });
    }

    function initChatWidget() {
        if (window.__app.chatInit) return;
        window.__app.chatInit = true;

        var chatWidget = document.getElementById('chatWidget');
        var openChatBtn = document.getElementById('openChatBtn');
        var closeChatBtn = document.getElementById('closeChatBtn');

        if (!chatWidget || !openChatBtn) return;

        openChatBtn.addEventListener('click', function() {
            chatWidget.classList.add('show');
            chatWidget.style.animation = 'slideInUp 0.4s ease-out';
            openChatBtn.style.display = 'none';
        });

        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', function() {
                chatWidget.style.animation = 'slideOutDown 0.4s ease-in';
                setTimeout(function() {
                    chatWidget.classList.remove('show');
                    openChatBtn.style.display = 'flex';
                }, 400);
            });
        }

        var chatStyle = document.createElement('style');
        chatStyle.innerHTML = '@keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }';
        document.head.appendChild(chatStyle);
    }

    function initLazyLoading() {
        if (window.__app.lazyLoadInit) return;
        window.__app.lazyLoadInit = true;

        var images = document.querySelectorAll('img:not([loading])');
        images.forEach(function(img) {
            if (!img.classList.contains('c-logo__img') && !img.hasAttribute('data-critical')) {
                img.setAttribute('loading', 'lazy');
            }
        });

        var videos = document.querySelectorAll('video:not([loading])');
        videos.forEach(function(video) {
            video.setAttribute('loading', 'lazy');
        });
    }

    function init() {
        if (window.__app.initialized) return;
        window.__app.initialized = true;

        initLazyLoading();
        initBurgerMenu();
        initSmoothScroll();
        initScrollSpy();
        initScrollAnimations();
        initMicroInteractions();
        initCountUp();
        initFormValidation();
        initModalHandlers();
        initScrollToTop();
        initAccordions();
        initChatWidget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
