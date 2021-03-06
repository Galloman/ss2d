// Copyright (c) 2013 David Gallardo Moreno. All rights reserved.

/**
 * @fileoverview Particle system emitter
 * @see http://www.71squared.com/en/particledesigner
 * @author David Gallardo Moreno (portalg@gmail.com)
 */

goog.provide('ss2d.ParticleEmitter');

goog.require('ss2d.ResourceManager');
goog.require('ss2d.Quad');
goog.require('ss2d.Particle');
goog.require('ss2d.Matrix3');

ss2d.ParticleEmitter = function(x, y, w, h, particleSystem)
{
	
	ss2d.Quad.call(this, x, y, w, h);
	this.mPivotX = this.mWidth*0.5;
	this.mPivotY = this.mHeight*0.5;
	
	if(RENDER_CONTEXT != 'webgl') 
		throw 'ss2d.ParticleEmitter requires WebGL Rendering Context';
		
	if(!particleSystem)
		throw 'No particle system provided';
	
	this.mParticleSystem = particleSystem;
	this.mActive = false;
	this.mShowHitBox = true;
	
	if(typeof particleSystem == 'string')
		this.mParticleSystem = ss2d.ResourceManager.loadParticleSystem(particleSystem, this.setup, this);
};

goog.inherits(ss2d.ParticleEmitter, ss2d.Quad);

ss2d.ParticleEmitter.MAX_UPDATE_RATE = 100;

ss2d.ParticleEmitter.prototype.setup = function(particleSystem)
{
	this.mParticleSystem = particleSystem;
	this.mTexture = this.mParticleSystem.mTexture;
	
	var desc = this.mParticleSystem.mSystemDescriptor;
	
	this.mSourcePosition = new ss2d.Point(parseFloat(desc['sourcePosition']['-x']),
										  parseFloat(desc['sourcePosition']['-y']));
	this.mSourcePositionVariance = new ss2d.Point(parseFloat(desc['sourcePositionVariance']['-x']),
										  		  parseFloat(desc['sourcePositionVariance']['-y']));		
	this.mGravity = new ss2d.Point(parseFloat(desc['gravity']['-x']),
								   parseFloat(desc['gravity']['-y']));
								   
	this.mAngle = parseFloat(desc['angle']['-value']); 
	this.mAngleVariance = parseFloat(desc['angleVariance']['-value']);								
	this.mSpeed = parseFloat(desc['speed']['-value']); 
	this.mSpeedVariance = parseFloat(desc['speedVariance']['-value']);	
    this.mRadialAcceleration = parseFloat(desc['radialAcceleration']['-value']); 
    this.mTangentialAcceleration = parseFloat(desc['tangentialAcceleration']['-value']);
    this.mRadialAccelVariance = parseFloat(desc['radialAccelVariance']['-value']); 
    this.mTangentialAccelVariance = parseFloat(desc['tangentialAccelVariance']['-value']);
	this.mParticleLifeSpan = Math.max(0.08, parseFloat(desc['particleLifeSpan']['-value'])); 
	this.mParticleLifespanVariance = parseFloat(desc['particleLifespanVariance']['-value']);			
	this.mStartParticleSize = parseFloat(desc['startParticleSize']['-value']); 
	this.mStartParticleSizeVariance = parseFloat(desc['startParticleSizeVariance']['-value']);
	this.mFinishParticleSize = parseFloat(desc['finishParticleSize']['-value']); 
	var fpsvk = desc['finishParticleSizeVariance']||desc['FinishParticleSizeVariance'];
	this.mFinishParticleSizeVariance = parseFloat(fpsvk['-value']);
	this.mMaxParticles = parseFloat(desc['maxParticles']['-value']);
	this.mDuration = parseFloat(desc['duration']['-value']);
    this.mRotationStart = parseFloat(desc['rotationStart']['-value']); 
    this.mRotationStartVariance = parseFloat(desc['rotationStartVariance']['-value']);
    this.mRotationEnd = parseFloat(desc['rotationEnd']['-value']); 
    this.mRotationEndVariance = parseFloat(desc['rotationEndVariance']['-value']);
    this.mBlendFuncSource = parseFloat(desc['blendFuncSource']['-value']);
    this.mBlendFuncDestination = parseFloat(desc['blendFuncDestination']['-value']);
    
    this.mStartColor = [parseFloat(desc['startColor']['-red']), 
    					parseFloat(desc['startColor']['-green']),
    					parseFloat(desc['startColor']['-blue']),
    					parseFloat(desc['startColor']['-alpha'])]; 
	this.mStartColorVariance = [parseFloat(desc['startColorVariance']['-red']), 
		    					parseFloat(desc['startColorVariance']['-green']),
		    					parseFloat(desc['startColorVariance']['-blue']),
		    					parseFloat(desc['startColorVariance']['-alpha'])];					
	this.mFinishColor = [parseFloat(desc['finishColor']['-red']), 
    					 parseFloat(desc['finishColor']['-green']),
    					 parseFloat(desc['finishColor']['-blue']),
    					 parseFloat(desc['finishColor']['-alpha'])];
	this.mFinishColorVariance = [parseFloat(desc['finishColorVariance']['-red']), 
		    					 parseFloat(desc['finishColorVariance']['-green']),
		    					 parseFloat(desc['finishColorVariance']['-blue']),
		    					 parseFloat(desc['finishColorVariance']['-alpha'])];
    
    //These values are used for the special purpose of creating the spinning portal emitter.
    this.mMaxRadius = parseFloat(desc['maxRadius']['-value']);					// Max radius at which particles are drawn when rotating
	this.mMaxRadiusVariance = parseFloat(desc['maxRadiusVariance']['-value']);			// Variance of the maxRadius
	this.mMinRadius = parseFloat(desc['minRadius']['-value']);					// Radius from source below which a particle dies
	this.mRotatePerSecond = parseFloat(desc['rotatePerSecond']['-value']);				// Numeber of degress to rotate a particle around the source pos per second
	this.mRotatePerSecondVariance = parseFloat(desc['rotatePerSecondVariance']['-value']);		// Variance in degrees for rotatePerSecond
	this.mRadiusSpeed = 0; 		// The speed at which a particle moves from maxRadius to minRadius
	
	//control properties
	this.mRotation = - this.mAngle / (180.0 / Math.PI);
	this.mEmitterType = parseFloat(desc['emitterType']['-value']);
	this.mParticleCount = 0;
	this.mEmissionRate = this.mMaxParticles / this.mParticleLifeSpan;
	this.mEmitCounter = 0;	
	this.mElapsedTime = 0;
	
	
	this.mUseTexture = true;
	this.mParticleIndex = 0;
	this.mParticles = [];
	this.mParticleDataArray = new Float32Array(this.mMaxParticles);
	
	var worldLocation = this.localToWorld(this.mLocation);
	worldLocation = ss2d.CURRENT_VIEW.mMainScene.getTransformationMatrix().invert().transformPoint(worldLocation);
	for(var i = 0; i < this.mMaxParticles; ++i)
	{
		this.mParticles[i] = this.generateParticle(null, worldLocation, i*0.008);
		this.mParticles[i].getPCBufferArray(this.mParticleDataArray, i * 24);
	}
	this.mParticleCount = this.mMaxParticles;
	var gl = ss2d.CURRENT_VIEW.mContext;
	var renderSupport = ss2d.CURRENT_VIEW.mRenderSupport;
	
	this.mParticleDataBuffer = renderSupport.createBuffer(gl.ARRAY_BUFFER, 
														  new Float32Array(this.mParticleDataArray), 
														  6,  this.mParticleDataArray.length / 6,
														  gl.DYNAMIC_DRAW);
	this.mFreeParticles = [];
	this.mReady = true;
	this.startEmitter();
};

ss2d.ParticleEmitter.prototype.startEmitter = function(p)
{
	this.mActive = true;
};

ss2d.ParticleEmitter.prototype.stopEmitter = function(p)
{
	this.mActive = false;
};

/*s2d.ParticleEmitter.MINUS_ONE_TO_ONE = function()
{
	return ((Math.random() * 2.0) - 1.0);
}
*/
ss2d.ParticleEmitter.prototype.generateParticle = function(particle, worldLocation, addedLifeTime)
{
	if(this.mParticleCount >= this.mMaxParticles)
		return;
		
	particle = particle||new ss2d.Particle();
	addedLifeTime = addedLifeTime||0;
	particle.mTimeStamp = ss2d.CURRENT_VIEW.mTotalTime;
	
	//var m1to1 = ss2d.ParticleEmitter.MINUS_ONE_TO_ONE;
	
	particle.mPosition.mX = worldLocation.mX + (((Math.random() * 2.0) - 1.0) * this.mSourcePositionVariance.mX);
	particle.mPosition.mY = worldLocation.mY + (((Math.random() * 2.0) - 1.0) * this.mSourcePositionVariance.mY);
	particle.mStartPos.mX = worldLocation.mX;
	particle.mStartPos.mY = worldLocation.mY;
	
	var newAngle = this.mRotation + (((Math.random() * 2.0) - 1.0) * this.mAngleVariance / (180 / Math.PI));
	var vector = new ss2d.Point(Math.cos(newAngle), Math.sin(newAngle));
	var vectorSpeed = this.mSpeed + (((Math.random() * 2.0) - 1.0) * this.mSpeedVariance);
	particle.mDirection = ss2d.Point.scalePoint(vector, vectorSpeed);
	particle.mRadius = this.mMaxRadius + (((Math.random() * 2.0) - 1.0) * this.mMaxRadiusVariance);
	
	particle.mRadiusDelta = (this.mMaxRadius / this.mParticleLifeSpan);// * (1.0 / ss2d.ParticleEmitter.MAX_UPDATE_RATE);
	particle.mAngle  = this.mRotation + (((Math.random() * 2.0) - 1.0) * this.mAngleVariance / (180 / Math.PI));
	particle.mDegreesPerSecond = (this.mRotatePerSecond + (((Math.random() * 2.0) - 1.0) *  this.mRotatePerSecondVariance)) / (180 / Math.PI);
	
	particle.mRadialAcceleration = this.mRadialAcceleration;
	particle.mTangentialAcceleration = this.mTangentialAcceleration;
	
	particle.mTimeToLive = Math.max(0, this.mParticleLifeSpan + (this.mParticleLifespanVariance * ((Math.random() * 2.0) - 1.0))) + addedLifeTime;
	
	var particleStartSize = this.mStartParticleSize + (this.mStartParticleSizeVariance * ((Math.random() * 2.0) - 1.0));
	var particleFinishSize = this.mFinishParticleSize + (this.mFinishParticleSizeVariance * ((Math.random() * 2.0) - 1.0));
	particle.mParticleSizeDelta = ((particleFinishSize - particleStartSize)  / this.mParticleLifeSpan) / this.mTexture.mTextureElement.width;
	particle.mParticleSize = Math.max(0, particleStartSize);
	
	var startColor = particle.mColor;
	startColor[0]  = this.mStartColor[0] + (this.mStartColorVariance[0] * ((Math.random() * 2.0) - 1.0));
	startColor[1]  = this.mStartColor[1] + (this.mStartColorVariance[1] * ((Math.random() * 2.0) - 1.0));
	startColor[2]  = this.mStartColor[2] + (this.mStartColorVariance[2] * ((Math.random() * 2.0) - 1.0));
	startColor[3]  = this.mStartColor[3] + (this.mStartColorVariance[3] * ((Math.random() * 2.0) - 1.0));
	
	var endColor = [];
	endColor[0]  = this.mFinishColor[0] + (this.mFinishColorVariance[0] * ((Math.random() * 2.0) - 1.0));
	endColor[1]  = this.mFinishColor[1] + (this.mFinishColorVariance[1] * ((Math.random() * 2.0) - 1.0));
	endColor[2]  = this.mFinishColor[2] + (this.mFinishColorVariance[2] * ((Math.random() * 2.0) - 1.0));
	endColor[3]  = this.mFinishColor[3] + (this.mFinishColorVariance[3] * ((Math.random() * 2.0) - 1.0));
	
	var deltaColor = particle.mDeltaColor;
	deltaColor[0] = ((endColor[0] - startColor[0]) / particle.mTimeToLive) / this.mParticleLifeSpan;
	deltaColor[1] = ((endColor[1] - startColor[1]) / particle.mTimeToLive) / this.mParticleLifeSpan;
	deltaColor[2] = ((endColor[2] - startColor[2]) / particle.mTimeToLive) / this.mParticleLifeSpan;
	deltaColor[3] = ((endColor[3] - startColor[3]) / particle.mTimeToLive) / this.mParticleLifeSpan;
	
	var startA = this.mRotationStart + (this.mRotationStartVariance * ((Math.random() * 2.0) - 1.0));
	var endA = this.mRotationEnd + (this.mRotationEndVariance * ((Math.random() * 2.0) - 1.0));
	
	particle.mRotation = startA;
	particle.mRotationDelta = (endA - startA) / this.mParticleLifeSpan;
	
	this.mParticleCount++;
	
	return particle;
};

if(RENDER_CONTEXT == 'webgl')
{
	ss2d.ParticleEmitter.prototype.render = function(support)
	{
		if(!this.mReady)
			return;
			
		this.mPivotX = this.mWidth*0.5;
		this.mPivotY = this.mHeight*0.5;

		var gl = support.mContext;
		
		gl.blendFunc(this.mBlendFuncSource, this.mBlendFuncDestination);

		var material = support.mMaterials.mParticle;
		material.mActiveTexture = this.mTexture.mTextureId;
		material.mParticleDataBuffer = this.mParticleDataBuffer;
		material.mParticleDataArray = this.mParticleDataArray;
		
		material.apply(support);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, support.mBuffers.mParticlesQVI);
		gl.drawElements(gl.TRIANGLES, this.mMaxParticles * 6, gl.UNSIGNED_SHORT, 0);
		
		gl.blendFunc(support.mDefaultBlendSource, support.mDefaultBlendDestination);
		
		if(this.mShowHitBox)
		{
			var prevAlpha = this.mAlpha;
			this.mAlpha = 0.5;
			ss2d.Quad.prototype.render.call(this, support);
			this.mAlpha = prevAlpha;
		}
	};
	
	ss2d.ParticleEmitter.prototype.tick = function(deltaTime)
	{
		this.updateParticles(deltaTime);
	};
	
	ss2d.ParticleEmitter.prototype.updateParticles = function(deltaTime)
	{
		if(!this.mReady)
			return;
		
		var gl = ss2d.CURRENT_VIEW.mContext;
		var renderSupport = ss2d.CURRENT_VIEW.mRenderSupport;
		if(this.mActive && this.mEmissionRate)
		{
			var rate = 1.0/this.mEmissionRate;
			this.mEmitCounter += deltaTime;
			var auxParticleArray = [];
			var worldLocation = this.localToWorld(this.mLocation);
			worldLocation = ss2d.CURRENT_VIEW.mMainScene.getTransformationMatrix().invert().transformPoint(worldLocation);
			while(this.mParticleCount < this.mMaxParticles && this.mEmitCounter > rate)
			{
				this.mEmitCounter -= rate;
				
				if(this.mFreeParticles.length == 0)
					continue;
				
				
				var particleIndex = this.mFreeParticles.pop();
				var particle = this.generateParticle(this.mParticles[particleIndex], worldLocation);
				auxParticleArray = particle.getArray(auxParticleArray);
				
				//4 times, one per vertex
				auxParticleArray = auxParticleArray.concat(auxParticleArray);
				auxParticleArray = auxParticleArray.concat(auxParticleArray);
				
				gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticleDataBuffer);
				gl.bufferSubData(gl.ARRAY_BUFFER, 
								 particleIndex * 4 * ss2d.Particle.SRUCT_SIZE * 4,
								 new Float32Array(auxParticleArray));
			}
			
			this.mElapsedTime += deltaTime;
			if(this.mDuration != -1 && this.mDuration < this.mElapsedTime)
				this.stopEmitter();
		}
		
		for(var p_index = 0; p_index < this.mMaxParticles; ++p_index)
		{
			var particle = this.mParticles[p_index];
			particle.mTimeToLive -= deltaTime;
			var timeLapse = ss2d.CURRENT_VIEW.mTotalTime - particle.mTimeStamp;
			particle.mRadius -= (particle.mRadiusDelta * deltaTime);
			
			//REPLACING SHADER FUNCTIONALITY
			
			
			
			if(particle.mTimeToLive <= 0.0 || (this.mEmitterType == 1.0 && particle.mRadius < this.mMinRadius))
			{
				this.mParticleCount--;
				this.mFreeParticles.push(p_index);
			}
		}
		
		//console.log(ss2d.CURRENT_VIEW.mTotalTime - this.mParticles[0].mTimeStamp);
	};
}

