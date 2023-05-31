
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';


import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { ReactComponent as FancyPen } from './pen-fancy-solid.svg';

registerBlockType(metadata.name, {
	icon: <FancyPen />,
	edit: Edit,
	save,
});
