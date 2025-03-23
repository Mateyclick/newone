
// Function to convert base64 to Blob
export const b64toBlob = (b64Data: string, contentType: string): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

// Function to remove background using remove.bg API
export const removeBackground = async (
  backgroundImage: string,
  apiKey: string
): Promise<{ success: boolean; data?: string; error?: string }> => {
  try {
    if (!backgroundImage || !apiKey) {
      return {
        success: false,
        error: !backgroundImage 
          ? "Por favor, sube una imagen primero" 
          : "Por favor, ingresa tu API key de remove.bg"
      };
    }
    
    // Convert the base64 image to a Blob
    const base64Data = backgroundImage.split(',')[1];
    const blob = b64toBlob(base64Data, 'image/png');
    
    const formData = new FormData();
    formData.append('image_file', blob, 'image.png');
    formData.append('size', 'auto');
    
    // Call the remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from remove.bg:", errorText);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    // Convert the response to base64
    const imageBlob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(imageBlob);
    });
    
  } catch (error) {
    console.error("Error removing background:", error);
    return {
      success: false,
      error: "Error al procesar la imagen. Verifica tu API key y la conexión a internet."
    };
  }
};
