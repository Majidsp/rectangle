window.rectanglesData = [
    { id: 0, x: 100, y: 100, width: 200, height: 150, radius: 10 },
    { id: 1, x: 400, y: 150, width: 300, height: 100, radius: 30 },
    { id: 2, x: 150, y: 400, width: 250, height: 150, radius: 20 },
];

class Rectangle {
    constructor(id, x, y, width, height, radius) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    setCornerRadius(cornerRadious) {
        this.radius = cornerRadious;
    }

    toJSON() {
        return JSON.stringify({
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            radius: this.radius,
        });
    }
}

class App {
    constructor(data) {
        data.forEach((element) => {
            this[element.id] = new Rectangle(
                element.id,
                element.x,
                element.y,
                element.width,
                element.height,
                element.radius
            );
        });
    }

    getRectById(id) {
        return this[id];
    }
}

const application = new App(rectanglesData);

const rectangleMCreator = (data) => {
    return `<div class="rect" style="top:${data.y}px;left:${data.x}px;width:${data.width}px;height:${data.height}px;border-radius:${data.radius}px">
        </div><div class="handle" style="top:${data.y}px;left:${data.x}px"></div>
            
`;
};

const dragElement = (elmnt) => {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if (elmnt.className === "handle") {
            if (
                elmnt.previousElementSibling.offsetTop <
                    elmnt.offsetTop - pos2 &&
                elmnt.previousElementSibling.offsetTop +
                    elmnt.previousElementSibling.offsetHeight >
                    elmnt.offsetTop - pos2
            ) {
                elmnt.style.top = elmnt.offsetTop - pos2 + "px";
                elmnt.previousElementSibling.style.borderRadius =
                    elmnt.offsetTop -
                    elmnt.previousElementSibling.offsetTop +
                    "px";
            }
        } else {
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
            elmnt.nextElementSibling.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.nextElementSibling.style.left =
                elmnt.offsetLeft - pos1 + "px";
        }
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

const rectangleDrawer = (data) => {
    let content = "";
    for (const rec in data) {
        content = content + rectangleMCreator(data[rec]);
    }
    document.getElementById("content").innerHTML = content;
    document.querySelectorAll(".rect").forEach((elm) => dragElement(elm));
    document.querySelectorAll(".handle").forEach((elm) => dragElement(elm));
};

rectangleDrawer(application);
