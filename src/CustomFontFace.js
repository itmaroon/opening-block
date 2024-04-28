import { useEffect } from '@wordpress/element';

// CustomFontFace component
const CustomFontFace = ({ attributes, setAttributes }) => {
  const weights = {
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  };
  useEffect(() => {
    fetch(opening_block.plugin_url + '/build/fileList.json')
      .then(response => response.json())
      .then((data) => {
        const newFontFamilyOptions = data.map((fontInfo) => {
          const font_arr = fontInfo.match(/(.*)-(.*)\.ttf/);
          const style = font_arr[2].includes("Italic") ? "italic" : "normal";
          const weight = font_arr[2].replace('Italic', '').trim().toLowerCase();
          const weight_val = weights[weight] || '400';

          // Add the @font-face rule
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            @font-face {
              font-family: '${font_arr[1]}';
              src: url('${opening_block.plugin_url}/assets/fonts/${font_arr[0]}') format('truetype');
              font-weight: ${weight_val};
              font-style: ${style};
            }
          `;
          document.head.appendChild(styleElement);

          return {
            value: font_arr[0],
            label: `${font_arr[1]} ${weight}`,
            fontFamily: font_arr[1],
            fontWeight: weight_val,
            fontStyle: style
          };
        });

        setAttributes({ fontFamilyOptions: newFontFamilyOptions });
      })
      .catch(error => console.error('Error:', error));

    // Cleanup function: remove the style tag when the component is unmounted
    return () => {
      Array.from(document.querySelectorAll('#custom-font-face')).forEach(el => el.remove());
    };
  }, []);

  return null;  // This component doesn't render anything
};

export default CustomFontFace;

