// Copyright (c) 2013 David Gallardo Moreno. All rights reserved.

/**
 * @fileoverview Texture loader
 * @author David Gallardo Moreno (portalg@gmail.com)
 */

goog.provide('ss2d.Texture');

goog.require('ss2d.Defines');

/**
 * @constructor
 * @param {string} textureFile The resource name
 * @param {function} callbackFunction Called when the texture is loaded
 */
ss2d.Texture = function(textureFile, callbackFunction)
{	
	//resource loading info
	this.mName = textureFile;
	
	/** @type {Image} */
	this.mTextureElement = new Image();
	this.mTextureElement.mTexture = this;
	this.mCallbackFunction = callbackFunction || function(){};
	
	this.mTextureElement.onload = function()
	{ 
		this.mTexture.handleLoadedTexture(); 
	};

	this.mTextureElement.src = textureFile;
}

/**
 * Method called when the texture is loaded
 */
ss2d.Texture.prototype.handleLoadedTexture = function()
{
	this.mCallbackFunction.call(null, this); 
	//if(RENDER_CONTEXT == 'webgl')
	//{
		//create texture in webgl
	//}
};

/**
 * @return {number} the width of the texture in pixels
 */
ss2d.Texture.prototype.getWidth = function()
{ 
	return this.mTextureElement.width; 
};

/**
 * @return {number} the height of the texture in pixels
 */
ss2d.Texture.prototype.getHeight = function()
{ 
	return this.mTextureElement.height; 
};
