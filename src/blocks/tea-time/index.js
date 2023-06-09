
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';


import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { ReactComponent as Teatime } from './mug-hot-solid.svg';


registerBlockType(metadata.name, {
	icon: <Teatime />,
	edit: Edit,
	save,
});
