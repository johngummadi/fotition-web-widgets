var BASE_URL = null;
var API_TOKEN = null;

var MODAL = undefined;

! function() {
    initScripts();
    initCSS();
    initServerSettings();
    initFotes();    
}();

function initServerSettings() {
    var fotition = document.getElementsByTagName("fotition");
    if (fotition && fotition.length>0) {
        API_TOKEN = fotition[0].getAttribute("apitoken");
        BASE_URL = fotition[0].getAttribute("baseurl");
    }
}

function initFotes() {
    var fotes = document.getElementsByTagName("fote");

    for (var i = 0; i<fotes.length; i++) {
        var btn = document.createElement("BUTTON");
        btn.setAttribute("class", "btn--fote");
        btn.innerHTML = fotes[i].getAttribute("text");

        fotes[i].appendChild(btn);

        btn.onclick = function(campaignId) {
            var campaignId = this.parentNode.getAttribute("campaignid");
            showModal(getTermsPageContent(campaignId), true);
        };
    }
}

function loadCampaign(campaignId) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     showModal(renderCampain(this.responseText), true);
    }
  };
  xhttp.open("GET", BASE_URL + "campaigns/" + campaignId, true);
  xhttp.setRequestHeader("apiToken", API_TOKEN);
  xhttp.send();
}


function initCSS() {
    var cssId = 'mycss'; // you could encode the css path itself to generate id..
    if (!document.getElementById(cssId)) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'fotition.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function initScripts() {
    loadScript("./jquery-3.1.1.min.js", "jquery-3.1.1.min");
}

function loadScript(url, scriptId) {
    var jsId = 'myjs'; // you could encode the css path itself to generate id..
    if (!document.getElementById(scriptId)) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.id = scriptId;
        
        // // Then bind the event to the callback function.
        // // There are several events for cross browser compatibility.
        // script.onreadystatechange = callback;
        // script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }
}

Element.prototype.insertChildAtIndex = function(child, index) {
  if (!index) index = 0
  if (index >= this.children.length) {
    this.appendChild(child)
  } else {
    this.insertBefore(child, this.children[index])
  }
}

function showModal(innerDiv, addCloseButton, color) {
    var modal = document.getElementById("global_modal");
    var mdlContent = document.getElementById("global_modal_content_area");
    var mdlCloseBtn = document.getElementById("global_modal_close");

    if (! modal) {
        modal = createElement("div", {"id":"global_modal", "class":"modal"}, null, document.body);
        mdlContent = createElement("div", {"id":"global_modal_content_area", "class":"modal-content-area"}, null, modal);
        modal.onclick = handleClose;
        mdlContent.onclick = handleClose;
    }

    if (innerDiv) {
        mdlContent.innerHTML = "";
        mdlContent.appendChild(innerDiv);
        // Ad close button
        if (addCloseButton) {
            //var mdlCloseBtn = createElement("img", {"id":"global_modal_close", "class":"modal-close-button", "src":"./iconx.png", "width":"50px", "height":"50px"}, null, null);
            var mdlCloseBtn = createElement("div", {"id":"global_modal_close", "class":"modal-close-button"}, null, null);
            innerDiv.insertChildAtIndex(mdlCloseBtn, 0);
            mdlCloseBtn.setAttribute("class", "modal-close-button");
            mdlCloseBtn.onclick = handleClose;
        }
    }

    if (color) {
        mdlContent.style.backgroundColor = color;
    }
    modal.style.display = "block";
}

var handleClose = function(e) {
    if (e.target.id == "global_modal" || e.target.id == "global_modal_content_area" || e.target.id == "global_modal_close") {
        var modal = document.getElementById("global_modal");
        modal.style.display = "none";
        return true;
    }
};


function createElement(elemType, attribs, innerHTML, parentDiv) {
    var elem = document.createElement(elemType);
    for (var key in attribs) {
        if (attribs.hasOwnProperty(key)) {
            console.log(key + " -> " + attribs[key]);
            elem.setAttribute(key, attribs[key]);
        }
    }
    if (innerHTML) {
        elem.innerHTML = innerHTML;
    }
    if (parentDiv) {
        parentDiv.appendChild(elem);
    }
    return elem;
}



function getTermsPageContent(campaignId) {
    var termsText = "To complete your photo submission, you must use technology powered by Fotition. Fotition's <a href=\"https://fotition.com/terms-and-conditions\" target=\"_blank\"><b>Terms of Use</b></a> and <a href=\"https://fotition.com/privacy-policy\" target=\"_blank\"><b>Privacy Policy</b></a> will differ. By clicking continue below you agree and understand Marvel Studios and its affiliates are not responsible for your interaction with Fotition.";
    
    var termsContentDiv = createElement("div", {"class":"modal-content terms-content"}, null, null);
    termsContentDiv.style.backgroundColor = "#444";
    // termsContentDiv.style.maxWidth = "500px";
    // termsContentDiv.style.textAlign = "center";
    // termsContentDiv.style.verticalAlign = "middle";

    var fotitionImg = createElement(
        "img", 
        {"src":"http://static.marvelstudiosheroacts.com/v1.2.0/assets/images/fotition.png", "class":"fotition-img center"}, 
        null, 
        termsContentDiv);

    var termsTextDiv = createElement("div", {"class":"termstext center"}, termsText, termsContentDiv);
    var continueBtn = createElement("button", {"class":"btn--fote center"}, "CONTINUE", termsContentDiv);
    continueBtn.style.marginTop = "30px";
    continueBtn.style.marginBottom = "30px";

    continueBtn.onclick = function(e) {
        showModal(null, true);
        loadCampaign(campaignId);
        window.event.stopPropagation();
    };
    return termsContentDiv;
}

var handleAddPhoto = function(e) {
    var photoInput = document.getElementById('photoInput');
    if (photoInput.files && photoInput.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var campaignOverlayImgDiv = document.getElementById('campaignOverlayImgDiv');
            campaignOverlayImgDiv.style.backgroundImage = "url(" + e.target.result + ")";
            campaignOverlayImgDiv.style.backgroundSize = "cover";
            console.log("set set set !!!");
        }
        reader.readAsDataURL(photoInput.files[0]);
        console.log("Adding " + photoInput.files[0]);
    }
};

var openFileDialog = function(e) {
    var photoInput = document.getElementById('photoInput');
    photoInput.click();
}



function renderCampain(campaignJSONText) {
    var campaignJSON = JSON.parse(campaignJSONText);
    var campaignDiv = createElement("div", {"id":"campaignDiv", "class":"campaign-container"}, null, null);
    var description = campaignJSON.mission_description.text;
    var descriptionDiv = createElement("div", {"id":"descriptionDiv", "class":"description-text center"}, description, campaignDiv);
    var overlayHelpText = "Choose an overlay, add a photo and post. Easy as that!";
    var helpTextDiv = createElement("div", {"id":"helpTextDiv", "class":"overlay-help-text center"}, overlayHelpText, campaignDiv);

    var campaignOverlayImgDiv = createElement(
        "img", 
        {"id":"campaignOverlayImgDiv", "class":"fote-overlay-img center", "src":campaignJSON.overlays[0].image_url}, 
        null, 
        campaignDiv);

    var photoInput = createElement("input", {"id":"photoInput", "class":"hidden", "type":"file"}, null, campaignDiv);
    photoInput.onchange = handleAddPhoto;

    var photoBtn = createElement("button", {"class":"btn--fote center"}, "ADD A PHOTO", campaignDiv);
    photoBtn.onclick = openFileDialog;
    

    return campaignDiv;
}




