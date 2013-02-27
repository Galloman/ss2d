// Copyright (c) 2013 David Gallardo Moreno. All rights reserved.

/**
 * @fileoverview Loader for bitmap font loader files.
 * @author David Gallardo Moreno (portalg@gmail.com)
 */

goog.provide('ss2d.BitmapFontLoader');

goog.require('ss2d.ILoader');
goog.require('ss2d.BitmapFont');

/**
 * @constructor
 * @implements ss2d.ILoader
 * @static
 */
ss2d.BitmapFontLoader = {};

/**
 * The extension used in ResourceManager class.
 * @static
 * @type {string}
 */
ss2d.BitmapFontLoader.RESOURCE_EXTENSION = 'bmfont';

/**
 * Load the texture
 * @param {string} resourceFileName
 * @param {function} resourceLoadedCallback
 * @return {ss2d.Texture} The loaded texture
 */
ss2d.BitmapFontLoader.loadResource = function(resourceFileName, resourceLoadedCallback)
{
	return new ss2d.BitmapFont(resourceFileName, resourceLoadedCallback);
};
