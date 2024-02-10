
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';


import BlockEditWrapper from '../../BlockEditWrapper';
import save from './save';
import metadata from './block.json';
import { ReactComponent as FancyPen } from './pen-fancy-solid.svg';

//ブロックを遅延読込
const LazyEditComponent = React.lazy(() => import('./edit'));
const BlockEdit = (props) => {
	return <BlockEditWrapper lazyComponent={LazyEditComponent} {...props} />;
};

registerBlockType(metadata.name, {
	description: __("This is an animation of drawing characters with a pen.", 'block-collections'),
	icon: <FancyPen />,
	edit: BlockEdit,
	save,
});
