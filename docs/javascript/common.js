// These are the strings that TVs can reply back with when asked for their type
const TV_TYPES = {
    NONE: "NONE",
    TINYTV_2: "TinyTV2",
    TINYTV_MINI: "TinyTVMini",
    TINYTV_DIY: "TinyTVDiy"
};

let show = (element, showChildren=true) => {
    if(typeof(element) == "string") element = document.getElementById(element);

    element.classList.remove("invisible");

    // Don't want to show children, infinite loop otherwise
    if(element.parentElement) show(element.parentElement, false);

    if(showChildren){
        for(let icx=0; icx<element.children.length; icx++){
            show(element.children[icx]);
        }
    }
}

let hide = (element) => {
    if(typeof(element) == "string") element = document.getElementById(element);

    element.classList.add("invisible");

    for(let icx=0; icx<element.children.length; icx++){
        hide(element.children[icx]);
    }
}

let disable = (elementID) => {
    document.getElementById(elementID).disabled = true;
}

let play = (elementID) => {
    document.getElementById(elementID).currentTime = 0;
    document.getElementById(elementID).play();
}

let pause = (elementID) => {
    document.getElementById(elementID).pause();
}

let setClickCallback = (elementID, callback) => {
    document.getElementById(elementID).onclick = callback;
}

let setInnerText = (elementID, text) => {
    document.getElementById(elementID).innerText = text;
}

let hideAll = () => {
    let sectionChildren = document.getElementById("updateSection").children;

    // Start at index 1 to skip description header
    for(let icx=1; icx<sectionChildren.length; icx++){
        hide(sectionChildren[icx]);
    }
}

export { TV_TYPES, show, hide, disable, play, pause, setClickCallback, setInnerText, hideAll};