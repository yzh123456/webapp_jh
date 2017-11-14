var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
var clientHeight= document.documentElement.clientHeight || document.body.clientHeight;
var loadDiv = document.createElement("div");
loadDiv.className = "load";
$(loadDiv).css({'display':'none'});
var loaderDiv = document.createElement("div");
loaderDiv.className="loader";
var modelLoaderDiv = document.createElement("div");
modelLoaderDiv.className="model";
$(modelLoaderDiv).css({'zIndex':'99999'});

$(function(){
	$(loadDiv).append(loaderDiv);
	$("body").append(loadDiv);
	$("body").append(modelLoaderDiv);
});


function showLoading()
{
	$(modelLoaderDiv).css({'display':'block'});
	$(loadDiv).css({'left':(clientWidth - $(loadDiv).width()) / 2 + "px",'top':(clientHeight - $(loadDiv).height()) / 2 + "px"});
	$(loadDiv).css({'display':'block'});
}

function hideLoading()
{
	$(modelLoaderDiv).css({'display':'none'});
	$(loadDiv).css({'display':'none'});
}
