import React, { Component } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import ninjaUpImage from './ninja-up.png';
import ninjaDownImage from './ninja-down.png';
import ninjaLeftImage from './ninja-left.png';
import ninjaRightImage from './ninja-right.png';
import ninjaUpAttackImage from './ninja-up-attack.png';
import ninjaDownAttackImage from './ninja-down-attack.png';
import ninjaLeftAttackImage from './ninja-left-attack.png';
import ninjaRightAttackImage from './ninja-right-attack.png';


class Ninja extends Component {
	getAvailableImages() {
		return {
			'up': ninjaUpImage,
			'down': ninjaDownImage,
			'left': ninjaLeftImage,
			'right': ninjaRightImage,
			'up-attack': ninjaUpAttackImage,
			'down-attack': ninjaDownAttackImage,
			'left-attack': ninjaLeftAttackImage,
			'right-attack': ninjaRightAttackImage,
		};
	}

	getImage() {
		const status = this.props.status;
		const availableImages = this.getAvailableImages();

		return availableImages[status];
	}
  render() {
  	const {
  		x,
  		y,
  	} = this.props;

    return (
    	<div className="sprite" style={{top: `calc(${y}% - 20px)`, left: `calc(${x}% - 20px)`, }}>
	      <SpriteAnimator
				  sprite={this.getImage()}
				  width={40}
				  height={40}
				  fps={6}
				/>
			</div>
    );
  }
}

export default Ninja;