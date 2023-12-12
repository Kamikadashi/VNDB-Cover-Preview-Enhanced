# VNDB Cover Preview Enhanced

This script enhances the functionality of the original "VNDB Cover Preview" by improving the image preview feature on vndb.org. It previews covers when hovering over the respective hyperlinks, providing a more seamless and user-friendly experience.

## Improvements

The new script differs from the old one in the following ways:

1. **Improved Image Positioning**: The new script calculates the position of the image preview more accurately, ensuring that it always stays within the viewport. This means you won't have to scroll or adjust your screen to view the entire image.

2. **Delay on Hover**: The new script introduces a slight delay before the image preview appears. This prevents unnecessary loading of images when you're quickly moving your cursor across multiple links.

3. **Error Handling**: The new script checks if an image has loaded correctly. If there's an error (for example, the image link is broken), the script will remove the faulty link from the cache. This ensures that you won't encounter the same error again when hovering over the same link.

4. **Efficient Event Handling**: The new script uses event delegation for handling mouseover and mouseleave events. This is a more efficient approach, especially if there are many links on the page.
