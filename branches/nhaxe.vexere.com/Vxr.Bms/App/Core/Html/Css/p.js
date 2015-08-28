function vLCss(url) {
    /// <summary>
    /// Load css
    /// </summary>
    /// <param name="url">The css url / href</param>
    $('<link>').appendTo('head').attr({ type: 'text/css', rel: 'stylesheet' }).attr('href', url);
};