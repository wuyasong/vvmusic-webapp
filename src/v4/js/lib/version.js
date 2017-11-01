module.exports = function (version){
    var ver = String(version).split('.');
    var ver_01 = ver[0] * 255 * 255 * 255;
    var ver_02 = ver[1] * 255 * 255;
    var ver_03 = ver[2] * 255;
    var ver_04 = ver[3];

    return ver_01 + ver_02 + ver_03 + ver_04;
};