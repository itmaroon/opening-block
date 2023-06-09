
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';


import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { ReactComponent as Logo } from './l-solid.svg';

registerBlockType(metadata.name, {
	icon: <Logo />,
	edit: Edit,
	save,
});
