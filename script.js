let suggestedOrder = [];
let fieldCount = 1;  // Counter to keep track of the number of fields

function addField() {
    const field = document.createElement('div');
    field.className = 'field flex space-x-2';
    field.innerHTML = `
        <label for="field-${fieldCount}" class="sr-only">Field Type</label>
        <select id="field-${fieldCount}" class="type p-2 border rounded" title="Field Type">
            <option value="int8">int8</option>
            <option value="int16">int16</option>
            <option value="int32">int32</option>
            <option value="int64">int64</option>
        </select>
        <button onclick="removeField(this)" class="p-2 bg-red-500 text-white rounded">Remove</button>
    `;
    document.getElementById('fields').appendChild(field);
    fieldCount++;
}

function removeField(button) {
    button.parentElement.remove();
}

function calculate() {
    const fields = Array.from(document.querySelectorAll('.type'));
    let memoryLayout = document.getElementById('memoryLayout');
    let structSizeElement = document.getElementById('structSize');
    let efficiencyElement = document.getElementById('efficiency');
    let suggestedOrderElement = document.getElementById('suggestedOrder');
    memoryLayout.innerHTML = '';

    let currentAddress = 0;
    let totalPadding = 0;
    
    fields.forEach(field => {
        const type = field.value;
        const size = parseInt(type.replace('int', '')) / 8;
        const alignment = size;

        while (currentAddress % alignment !== 0) {
            memoryLayout.appendChild(createByte('padding'));
            currentAddress++;
            totalPadding++;
        }

        for (let i = 0; i < size; i++) {
            memoryLayout.appendChild(createByte(type));
            currentAddress++;
        }
    });

    const totalSize = currentAddress;
    structSizeElement.textContent = `Total Size: ${totalSize} bytes`;
    efficiencyElement.textContent = `Total Padding: ${totalPadding} bytes`;

    const sortedFields = fields.slice().sort((a, b) => {
        const sizeA = parseInt(a.value.replace('int', '')) / 8;
        const sizeB = parseInt(b.value.replace('int', '')) / 8;
        return sizeB - sizeA;
    });

    suggestedOrder = sortedFields.map(field => field.value);
    suggestedOrderElement.textContent = `Suggested Order: ${suggestedOrder.join(', ')}`;

    // Additional suggestion to the user if the allocation is inefficient
    const isInefficient = totalPadding > 0;
    if (isInefficient) {
        efficiencyElement.textContent += ` (Inefficient)`;
        efficiencyElement.classList.add('inefficient'); // Adiciona classe de estilo para eficiência ineficiente
    } else {
        efficiencyElement.textContent += ` (Efficient)`;
        efficiencyElement.classList.remove('inefficient'); // Remove a classe de estilo, se necessário
    }
}

function createByte(type) {
    const byte = document.createElement('div');
    byte.className = `byte border flex items-center justify-center m-0.5 ${type}`;
    byte.textContent = ' ';
    return byte;
}

function applySuggestedOrder() {
    const fieldsContainer = document.getElementById('fields');
    fieldsContainer.innerHTML = '';
    fieldCount = 0;  // Reset the counter

    suggestedOrder.forEach(type => {
        const field = document.createElement('div');
        field.className = 'field flex space-x-2';
        field.innerHTML = `
            <label for="field-${fieldCount}" class="sr-only">Field Type</label>
            <select id="field-${fieldCount}" class="type p-2 border rounded" title="Field Type">
                <option value="int8" ${type === 'int8' ? 'selected' : ''}>int8</option>
                <option value="int16" ${type === 'int16' ? 'selected' : ''}>int16</option>
                <option value="int32" ${type === 'int32' ? 'selected' : ''}>int32</option>
                <option value="int64" ${type === 'int64' ? 'selected' : ''}>int64</option>
            </select>
            <button onclick="removeField(this)" class="p-2 bg-red-500 text-white rounded">Remove</button>
        `;
        fieldsContainer.appendChild(field);
        fieldCount++;
    });
}
