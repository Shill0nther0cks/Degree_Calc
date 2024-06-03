// Function to add a new Level 2 module input fields
function addLevel2Module() {
    const div = document.createElement('div');
    div.innerHTML = `
        <label>Module Code: <input type="text" name="l2Code" required></label>
        <label>Credits: <input type="number" name="l2Credits" required></label>
        <label>Grade (1-4): <input type="number" name="l2Grade" min="1" max="4" required></label>
    `;
    document.getElementById('level2Modules').appendChild(div);
}

// Function to add a new Level 3 module input fields
function addLevel3Module() {
    const div = document.createElement('div');
    div.innerHTML = `
        <label>Module Code: <input type="text" name="l3Code" required></label>
        <label>Credits: <input type="number" name="l3Credits" required></label>
        <label>Grade (1-4): <input type="number" name="l3Grade" min="1" max="4" required></label>
    `;
    document.getElementById('level3Modules').appendChild(div);
}

// Function to calculate the degree classification based on the inputs
function calculateClassification() {
    // Get all Level 2 module codes, credits, and grades
    let l2Codes = document.getElementsByName('l2Code');
    let l2Modules = document.getElementsByName('l2Credits');
    let l2Grades = document.getElementsByName('l2Grade');
    // Get all Level 3 module codes, credits, and grades
    let l3Codes = document.getElementsByName('l3Code');
    let l3Modules = document.getElementsByName('l3Credits');
    let l3Grades = document.getElementsByName('l3Grade');

    // Check if the minimum required credits are met
    let l2TotalCredits = Array.from(l2Modules).reduce((sum, input) => sum + parseInt(input.value), 0);
    let l3TotalCredits = Array.from(l3Modules).reduce((sum, input) => sum + parseInt(input.value), 0);

    if (l2TotalCredits < 120 || l3TotalCredits < 120) {
        document.getElementById('result').innerText = '';
        document.getElementById('borderlineModules').innerText = '';
        document.getElementById('errorMessage').innerText = 'Error: You must enter at least 120 credits at Level 2 and 120 credits at Level 3.';
        return;
    } else {
        document.getElementById('errorMessage').innerText = '';
    }

    let l2Score = 0;
    // Calculate the Level 2 weighted score
    for (let i = 0; i < l2Modules.length; i++) {
        l2Score += l2Modules[i].value * l2Grades[i].value;
    }
    
    let l3Score = 0;
    // Calculate the Level 3 weighted score
    for (let i = 0; i < l3Modules.length; i++) {
        l3Score += l3Modules[i].value * l3Grades[i].value;
    }
    // Double the Level 3 score as per the calculation rules
    l3Score *= 2;
    
    // Calculate the total weighted score
    let totalScore = l2Score + l3Score;
    let resultText = `Total Weighted Score: ${totalScore}\n`;
    
    let classification = '';
    let borderlineMessage = '';
    let borderlineModules = [];
    
    // Determine the degree classification based on the total score
    if (totalScore <= 630) {
        classification = 'First Class (1)';
    } else if (totalScore <= 900) {
        [classification, borderlineMessage, borderlineModules] = borderlineTest(l3Codes, l3Grades, totalScore, 'First Class (1)', 'Upper Second Class (2:1)', 690, [1, 2]);
    } else if (totalScore <= 1170) {
        [classification, borderlineMessage, borderlineModules] = borderlineTest(l3Codes, l3Grades, totalScore, 'Upper Second Class (2:1)', 'Lower Second Class (2:2)', 960, [2, 3]);
    } else if (totalScore <= 1230) {
        [classification, borderlineMessage, borderlineModules] = borderlineTest(l3Codes, l3Grades, totalScore, 'Lower Second Class (2:2)', 'Third Class (3)', 1230, [3]);
    } else {
        classification = 'Third Class (3)';
    }

    resultText += `Degree Classification: ${classification}`;
    // Include borderline test message if applicable
    if (borderlineMessage) {
        resultText += ` (achieved via borderline test: ${borderlineMessage})`;
        displayBorderlineModules(borderlineModules);
    } else {
        document.getElementById('borderlineModules').innerText = '';
    }

    // Display the result
    document.getElementById('result').innerText = resultText;
}

// Function to check if the classification is achieved via borderline test
function borderlineTest(codes, grades, score, higherClass, lowerClass, borderlineScore, requiredGrades) {
    let gradeCount = 0;
    let borderlineModules = [];
    // Count the credits of the required grades and collect module codes
    for (let i = 0; i < grades.length; i++) {
        if (requiredGrades.includes(parseInt(grades[i].value))) {
            gradeCount += parseInt(grades[i].value) * parseInt(codes[i].value);
            if (gradeCount <= 60) {
                borderlineModules.push(codes[i].value);
            }
        }
    }
    // Check if the score is within the borderline range and if the required grade credits are met
    if (score <= borderlineScore && gradeCount >= 60) {
        return [higherClass, `at least 60 L3 credits at Grades ${requiredGrades.join(' or ')}`, borderlineModules];
    }
    return [lowerClass, '', []];
}

// Function to display the modules contributing to the borderline classification
function displayBorderlineModules(modules) {
    let text = 'Modules contributing to borderline classification: ' + modules.join(', ');
    document.getElementById('borderlineModules').innerText = text;
}
