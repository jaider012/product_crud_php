/**
 * Product form validation
 */
function validateProductForm() {
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let price = document.getElementById('price').value;
    
    let errors = [];
    
    // Validate name
    if (name.trim() === '') {
        errors.push('Product name is required');
    }
    
    // Validate description
    if (description.trim() === '') {
        errors.push('Description is required');
    }
    
    // Validate category
    if (category === '') {
        errors.push('You must select a category');
    }
    
    // Validate price
    if (price.trim() === '') {
        errors.push('Price is required');
    } else if (isNaN(price) || parseFloat(price) <= 0) {
        errors.push('Price must be a number greater than zero');
    }
    
    // Show errors if they exist
    if (errors.length > 0) {
        let errorMessage = 'The following errors were found:\n';
        errors.forEach(function(error) {
            errorMessage += '- ' + error + '\n';
        });
        
        alert(errorMessage);
        return false;
    }
    
    return true;
}

/**
 * Confirm product deletion
 */
function confirmDeletion(name) {
    return confirm('Are you sure you want to delete the product "' + name + '"?');
}

/**
 * Preview image before upload
 */
function previewImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            document.getElementById('previewImage').setAttribute('src', e.target.result);
            document.getElementById('previewImage').style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * Initialize events when document is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            if (!validateProductForm()) {
                e.preventDefault();
            }
        });
    }
    
    // Image preview
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            previewImage(this);
        });
    }
}); 