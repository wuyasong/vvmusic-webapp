module.exports = {
    show (selector) {
        var node = document.querySelector(selector);
        node.style.display = 'block';
        node.style.opacity = 0;
        node.style.webkitTransitionDuration = '0.5s';
        node.style.webkitTransitionProperty = 'opacity';

        setTimeout(function() {
            node.style.opacity = 1;
        }, 0);
    },
    hide (selector) {
        var node = document.querySelector(selector);
        node.style.opacity = 0;

        setTimeout(function() {
            node.style.display = 'none';
            node.style.webkitTransitionDuration = '';
            node.style.webkitTransitionProperty = '';
        }, 500);
    }
};