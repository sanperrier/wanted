import Scrollparent from 'scrollparent';

function scrollIntoCenter() {
    let window = this.ownerDocument.defaultView,
        parent = Scrollparent(this),
        rect = this.getBoundingClientRect();

    let offsetTop = window.innerHeight/2 - rect.top - rect.height/2,
        offsetLeft = window.innerWidth/2 - rect.left - rect.width/2;

    parent.scrollTop = parent.scrollTop - offsetTop;
    parent.scrollLeft = parent.scrollLeft - offsetLeft;
}


if(Element.prototype.scrollIntoCenter === undefined) {
    Element.prototype.scrollIntoCenter = scrollIntoCenter;
}

export default scrollIntoCenter;