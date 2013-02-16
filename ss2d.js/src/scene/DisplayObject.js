// Copyright (c) 2013 David Gallardo Moreno. All rights reserved.

/**
 * @fileoverview The atomic representation of an scene element.
 * @author David Gallardo Moreno (portalg@gmail.com)
 */

goog.provide('ss2d.DisplayObject');

goog.require('ss2d.Defines');
goog.require('ss2d.Object');
goog.require('ss2d.Point');
goog.require('ss2d.Matrix3');
goog.require('ss2d.Rectangle');
goog.require('ss2d.Color');

/**
 * @constructor
 * @param {number=} x Position in x axis 
 * @param {number=} y Position in y axis
 * @param {number=} scale Scale in both x and y axis
 * @param {number} rotation
 * @param {(number|string|Array.<number>|ss2d.Color)} color
 * @param {number} alpha Transparency
 * @property {ss2d.Point} mLocation Object location point
 * @property {number} mRotation Rotation in rads
 * @property {number} mPivotX Pivot in x axis
 * @property {number} mPivotY Pivot in y axis
 * @property {number} mScaleX Scale in x axis
 * @property {number} mScaleY Scale in y axis
 * @property {ss2d.DisplayObjectContainer} mParent Parent in scene tree
 * @property {ss2d.Color} mColor Color representation
 * @property {number} mAlpha Transparency
 */
ss2d.DisplayObject = function(x, y, scale, rotation, color, alpha)
{
	x = x || 0.0;
	y = y || 0.0;
	this.mLocation = new ss2d.Point(x, y);
	//this.mX = x || 0.0;
	//this.mY = y || 0.0;
	this.mRotation = rotation || 0.0;
	this.mPivotX = 0.0;
	this.mPivotY = 0.0;
	this.mScaleX = scale || 1.0;
	this.mScaleY = scale || 1.0;
	this.mParent = null;
	
	if(color instanceof ss2d.Color)
	{
		this.mColor = color;
	}
	else
	{
		color = color||0xffffff;
		this.mColor = new ss2d.Color(color);
	}
	
	this.mAlpha = alpha || 1.0;
	
	
	this.mObjectId = ss2d.Object.OBJECT_COUNT++;
	
	if(COMPILING_SERVER)
	{
		this.mSoundList = [];
	}
};

ss2d.Object.assignClassId(ss2d.DisplayObject, 1001);

/**
 * @param {ss2d.Matrix3} targetMatrix Matrix where dump the result
 * @return {ss2d.Matrix3} the local transformation of the object. 
 */
ss2d.DisplayObject.prototype.getTransformationMatrix = function(targetMatrix)
{
	targetMatrix = targetMatrix || new ss2d.Matrix3();
	
	if (this.mPivotX != 0.0 || this.mPivotY != 0.0)				{ targetMatrix.translate(-this.mPivotX,-this.mPivotY); }
	if (this.mOffsetX != 0.0 || this.mOffsetY != 0.0)			{ targetMatrix.translate(-this.mOffsetX,-this.mOffsetY); }
	if (this.mScaleX != 1.0 || this.mScaleY != 1.0)				{ targetMatrix.scale(this.mScaleX,this.mScaleY); }
	if (this.mRotation != 0.0)			 						{ targetMatrix.rotate(this.mRotation); }
	if (this.mLocation.mX != 0.0 || this.mLocation.mY != 0.0)	{ targetMatrix.translate(this.mLocation.mX,this.mLocation.mY); }
    
	return targetMatrix;
};

/**
 * @param {ss2d.Matrix3} targetMatrix Matrix where dump the result
 * @return {ss2d.Matrix3} The world transformation of the object. 
 */
//TODO: Modify to accept a top parent to iterate instead of the first one without parent.
ss2d.DisplayObject.prototype.getWorldTransformationMatrix = function(targetMatrix)
{
	var parentsStack = [];
	var currentParent = this;
	
	while(currentParent.mParent)
	{
		parentsStack.unshift(currentParent.mParent);
		currentParent = currentParent.mParent;
	}
	
	var transMatrix = new ss2d.Matrix3();
	var curMatrix = new ss2d.Matrix3();
	
	for(matIndex in parentsStack)
	{
		curMatrix.identity();
		parentsStack[matIndex].getTransformationMatrix(curMatrix);
		transMatrix.concatMatrix(curMatrix);
	}
	
	return transMatrix;
};

/**
 * Transform a point from world to local coordinate space
 * @param {ss2d.Point} point
 * @return {ss2d.Point} Transformed point
 */
ss2d.DisplayObject.prototype.worldToLocal = function(point)
{
	var invWorldMatrix = this.getWorldTransformationMatrix().invert();
	var transformedPoint = invWorldMatrix.transformPoint(point);
	delete worldMatrix;
	return transformedPoint;
};

/**
 * Sets the world coordinate space location using a point.
 * @param {ss2d.Point} point
 */
ss2d.DisplayObject.prototype.setGlobalLocation = function(point) 
{ 
	this.setLocation(this.worldToLocal(p)); 
};

/**
 * Sets the local coordinate space location using a point
 * @param {ss2d.Point} point
 */
ss2d.DisplayObject.prototype.setLocation = function(point)
{ 
	this.mLocation.mX = p.mX; 
	this.mLocation.mY = p.mY; 
};

/**
 * Called every frame to update object state. Implemented by User.
 * @param {number} deltaTime Seconds passed from the last frame.
 */
ss2d.DisplayObject.prototype.tick = function(deltaTime){};

/**
 * Called every frame to render the object. Implemented by User.
 * @param {ss2d.RenderSupport} support The ss2d.RenderSupport instance of the main view.
 */
ss2d.DisplayObject.prototype.render = function(support){};

/**
 * Implemented by child classes.
 * @return {ss2d.Rectangle} bounds of the object.
 */
ss2d.DisplayObject.prototype.getBounds = function(){ return null; };

/**
 * Implemented by child classes.
 * @return {ss2d.DisplayObject} Return the object that hits with the point or null if no hit is found.
 */
ss2d.DisplayObject.prototype.hitTestPoint = function(point){ return null; }; //function(ss2d.Point){ must be provided by child classes }

/**
 * Implemented by child classes.
 * @return {number}
 */
ss2d.DisplayObject.prototype.getWidth = function(){ return 0; }; //function(){ must be provided by child classes }

/**
 * Implemented by child classes.
 * @return {number}
 */
ss2d.DisplayObject.prototype.getHeight = function(){ return 0; }; //function(){ must be provided by child classes }

/**
 * Implemented by child classes.
 */
ss2d.DisplayObject.prototype.setWidth = function(w){ }; //function(){ must be provided by child classes }

/**
 * Implemented by child classes.
 */
ss2d.DisplayObject.prototype.setHeight = function(h){ }; //function(){ must be provided by child classes }



//*****************
//* SERIALIZATION *
//*****************/

if(COMPILING_CLIENT)
{
	/**
	 * Cast a JSON parsed object to a object of this type replacing the original object.
	 * This is currently not used by the mutiplayer subsystem.
	 * @param {Object} obj The JSON parsed object with 'cid' property.
	 * @return {ss2d.DisplayObject} A reference to the converted object.
	 */
	ss2d.DisplayObject.convert = function(obj)
	{
		var objBackup =  ss2d.Object.backupAndDeleteObjectProperties(obj);
		
		ss2d.DisplayObject.call(obj);
		
		obj.__proto__ = ss2d.DisplayObject.prototype;
		
		//now obj is a DisplayObject
		obj.restoreSerializedProperties(objBackup);
		
		return obj;
	}
	
	/**
	 * Copy all properties from a JSON parsed object to this object.
	 * This is currently not used by the mutiplayer subsystem.
	 * @param {Object} obj The JSON parsed object with 'cid' property.
	 */
	ss2d.DisplayObject.prototype.restoreSerializedProperties = function(objBackup)
	{
		this.CLASS_ID = objBackup['cid'];
		this.mLocation.mX = objBackup['x'] || this.mLocation.mX;
		this.mLocation.mY = objBackup['y'] || this.mLocation.mY;
		this.mRotation = objBackup['r'] || this.mRotation;
		this.mPivotX = objBackup['px'] || this.mPivotX;
		this.mPivotY = objBackup['py'] || this.mPivotY;
		this.mScaleX = objBackup['sx'] || this.mScaleX;
		this.mScaleY = objBackup['sy'] || this.mScaleY;
		this.mOffsetX = objBackup['ox'] || this.mOffsetX;
		this.mOffsetY = objBackup['oy'] || this.mOffsetY;
		this.mColor = new ss2d.Color(objBackup['c']) || this.mColor;
		this.mAlpha = objBackup['a'] || this.mAlpha;
	}
	
	/** 
	 * Create a new instance of this type from a JSON parsed object.
	 * Used by the multiplayer subsystem to create new objects coming from server.
	 * @expose
	 * @param {Object} obj The JSON parsed object with 'cid' property.
	 * @return {ss2d.DisplayObject}  
	 */
	ss2d.DisplayObject.createFromSerializedObject = function(obj)
	{
		var newDo = new ss2d.DisplayObject(obj['x'], obj['y'], obj['s'], obj['r'], obj['c']);
		newDo.mObjectId = obj['doid'];
		return newDo;
	}
	
	/**
	 * Interpolate the object state between a previous and future JSON parsed states.
	 * This method also calls the tick method for client side updates.
	 * @param {Object} prevState
	 * @param {Object} nextState
	 * @param {number} part Difference between both states to add to the current state.
	 * @param {number} deltaTime
	 */
	ss2d.DisplayObject.prototype.interpolateState = function(prevState, nextState, part, deltaTime)
	{	
		this.mLocation.mX = prevState['x'] + (nextState['x'] - prevState['x']) * part;
		this.mLocation.mY = prevState['y'] + (nextState['y'] - prevState['y']) * part;
		this.mRotation = prevState['r'] + (nextState['r'] - prevState['r']) * part;
		this.mPivotX = prevState['px'] + (nextState['px'] - prevState['px']) * part;
		this.mPivotY = prevState['py'] + (nextState['py'] - prevState['py']) * part;
		this.mScaleX = prevState['sx'] + (nextState['sx'] - prevState['sx']) * part;
		this.mScaleY = prevState['sy'] + (nextState['sy'] - prevState['sy']) * part;
		this.mOffsetX = prevState['ox'] + (nextState['ox'] - prevState['ox']) * part;
		this.mOffsetY = prevState['oy'] + (nextState['oy'] - prevState['oy']) * part;
		var ca = ss2d.Color.interpolate(prevState['c'], nextState['c'], part).getRGBArray();
		this.mColor.setRGB(ca[0],ca[1],ca[2]);
		this.mAlpha = prevState['a'] + (nextState['a'] - prevState['a']) * part;
		
		this.playSoundList(prevState);
		
		//client can update an object state even in an online game, this type of update is intended for non-gameplay 
		//related logic, for example when a player receives from server the state "Walking" and the client uses this 
		//information to play a SpriteReel animation that represents an avatar of the player walking.
		//tick can be defined only for the server, or for both with a block of code for the server and an other for the client.
		if(this.tick)
		{
			this.tick(deltaTime);
		}
	};
	
	/**
	 * Plays a list of sounds received from the server
	 * @param {Object} prevState
	 */
	ss2d.DisplayObject.prototype.playSoundList = function(prevState)
	{
		var soundList = prevState['snds'];
		if(soundList != null)
		{
			for(var soundIndex in soundList)
			{
				var sound = prevState['snds'][childIndex];
				try{
					ss2d.ResourceLoader.loadSound(sound).play();
				}catch(e){}
			}
			
			delete prevState['snds'];
		}
	};
}

if(COMPILING_SERVER)
{
	/**
	 * Converts this object into a JSON complaint string.
	 * @return {string} The serialized version of the object
	 */
	ss2d.DisplayObject.prototype.toJSON = function()
	{
		return '{'+this.getPropertiesJSON()+'}';
	};
	
	/**
	 * @return A string with all properties serialized in JSON format.
	 * SERIALIZACION SPEC
	 * CLASS_ID : cid
	 * mObjectId : doid
	 * mLocation.mX : x
	 * mLocation.mY : y
	 * mRotation : r
	 * mPivotX : px
	 * mPivotY : py
	 * mScaleX : sx
	 * mScaleY : sy
	 * mOffsetX : ox
	 * mOffsetY : oy
	 * mColor : c
	 * mAlpha : a
	 * mSoundList : snds
	 */
	ss2d.DisplayObject.prototype.getPropertiesJSON = function()
	{
		var str = '';
		
		str += '"cid":'+this.CLASS_ID+',';
		str += '"doid":'+this.mObjectId+',';
		//str += '"mLocation":{"mX":'+this.mLocation.mX+', "mY":'+this.mLocation.mY+'},';
		str += '"x":'+Math.floor(this.mLocation.mX*1000.0)/1000.0+',';
		str += '"y":'+Math.floor(this.mLocation.mY*1000.0)/1000.0+',';
		str += '"r":'+(Math.floor(this.mRotation*100)/100)+',';
		str += '"px":'+this.mPivotX+',';
		str += '"py":'+this.mPivotY+',';
		str += '"sx":'+this.mScaleX+',';
		str += '"sy":'+this.mScaleY+',';
		str += '"ox":'+this.mOffsetX+',';
		str += '"oy":'+this.mOffsetY+',';
		str += '"c":'+JSON.stringify(this.mColor.getRGBArray())+',';
		str += '"a":'+this.mAlpha;
		str += ',"snds":'+JSON.stringify(this.mSoundList);
		
		return str;
	};
}

//************************
//* END OF SERIALIZATION *
//************************/

//Setters and getters used by ss2d.Tween to animate properties
ss2d.DisplayObject.prototype.getX = function()
{
	return this.mLocation.mX; 
};

ss2d.DisplayObject.prototype.setX = function(x)
{
	this.mLocation.mX = x; 
};

ss2d.DisplayObject.prototype.getY = function()
{
	return this.mLocation.mY; 
};

ss2d.DisplayObject.prototype.setY = function(y)
{ 
	this.mLocation.mY = y; 
};

ss2d.DisplayObject.prototype.getRotation = function()
{
	return this.mRotation; 
};

ss2d.DisplayObject.prototype.setRotation = function(r)
{
	return this.mRotation = r;
}; 
 
ss2d.DisplayObject.prototype.getPivotX = function()
{
	return this.mPivotX; 
};
 
ss2d.DisplayObject.prototype.setPivotX = function(px)
{
	this.mPivotX = px; 
};
 
ss2d.DisplayObject.prototype.getPivotY = function()
{
	return this.mPivotY; 
};

ss2d.DisplayObject.prototype.setPivotY = function(py)
{
	this.mPivotY = py; 
};
 
ss2d.DisplayObject.prototype.getScaleX = function()
{
	return this.ScaleX; 
};

ss2d.DisplayObject.prototype.setScaleX = function(sx)
{
	this.mScaleX = sx;
};
 
ss2d.DisplayObject.prototype.getScaleY = function()
{
	return this.ScaleY; 
};

ss2d.DisplayObject.prototype.setScaleY = function(sy)
{
	this.mScaleY = sy; 
};

ss2d.DisplayObject.prototype.getAlpha = function()
{
	return this.mAlpha; 
};

ss2d.DisplayObject.prototype.setAlpha = function(a)
{
	this.mAlpha = a; 
};



