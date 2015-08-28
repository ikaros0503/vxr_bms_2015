function vLCss(url) {
    /// <summary>
    /// Load css
    /// </summary>
    /// <param name="url">The css url / href</param>
    $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', url);
};

function vLJS(url, cb) {
    $.getScript(url)
    .done(function (script, textStatus) {
            cb.call();
        })
    .fail(function (jqxhr, settings, exception) {
       // $("div.log").text("Triggered ajaxError handler.");
    });
};

function setAnimation($element, animationName, time) {
    /// <summary>set animation to element</summary>
    /// <param name="$element" type="string">selector to be set animation</param>
    /// <param name="animationName" type="string">name of animation on css</param>
    /// <param name="time" type="string">time of animation</param>
    $element.css('-webkit-animation', animationName + ' ' + time + ' ease-in-out').css('animation', animationName + ' ' + time + ' ease-in-out');
    $element.css('-webkit-animation-fill-mode', 'forwards').css('animation-fill-mode', 'forwards');
    return $element;
};

function setVisibleToElement($element, isVisible, speed) {
    /// <summary>show or hide element base on condition</summary>
    /// <param name="$element" type="string">selector to be set</param>
    /// <param name="isVisible" type="bool">condition</param>
    /// <param name="speed" type="string">speed of animation</param>
    isVisible ? $element.show(speed) : $element.hide(speed);
    return $element;
}

function setEnableToElement($element, isEnabled) {
    /// <summary>enable or disable element base on condition</summary>
    /// <param name="$element" type="string">selector to be set</param>
    /// <param name="isVisible" type="bool">condition</param>
    isEnabled ? $element.removeClass("disabled") : $element.addClass("disabled");
    return $element;
}