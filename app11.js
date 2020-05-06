/*
how and why to create a simple reusable functions with only one purpose 

how to sum all elements of an array using the for each method

*/




var budgetController = (function () {


    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totoals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1


    };
    
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.totoals[type] = sum;
    };
    

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // create a new ID 
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }

            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);

            }
            //push it into our data structure
            data.allItems[type].push(newItem);

            //return newItem;
            return newItem;

        },

        calculateBudget: function () {

            // 1.calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');



            // 2.calculate the budget: income - exppenses
            data.budget = data.totoals.inc - data.totoals.exp;



            // 3. calculate the precentage of income that we spent
            if (data.totoals.inc > 0) {
                data.percentage = Math.round((data.totoals.exp / data.totoals.inc) * 100);

            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totoals.inc,
                totalExp: data.totoals.exp,
                percentage: data.percentage
            };




        },



        testing: function () {
            console.log(data); // we see the value that is not a number. it is a string. in order to calculate this, we need to change string to number.
        }


    }






})();
console.log("this is budgetController including method listed below")
console.log(budgetController);


// })();





// UI controller 
var UIController = (function () {


    /*
    so remember we store all of these class names in the DOMstrings 

    therefore, we dont have all of these class name here floating around in all of these methods 

    */
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        bugetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage'
    }




    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                
                /* parseFloat convert the string to number */

            };

        },

        addlistItem: function (obj, type) {
            var html, newhtml, element;
            // create HTML string with placeholder text 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>';
            }


            // Replace the placeholder text with some actual data 
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);



            // insert the html into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newhtml);


        },
        clearFields: function () {
            // so the solution to that is to convert the list to an array 
            // becasue some methods, they are not applied to each of the elements in the list.
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.bugetLable).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLable).textContent = obj.totalExp;


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '---';
            }

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };



})();
console.log("this is UIController including method listed below")
console.log(UIController);






// global app controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);



        document.addEventListener('keypress', function (event) {


            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });



    };

    /* 
    why are you doing two seperated functions here? 
    
    so one that calculates the budget 
    and one that simply returns the budget
    each function has a specific task and that simply getting some information from a module is a good task for a simple function.
    
    */

    var updateBudget = function () {
        // 1.calculate the update budget 
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI 
        UICtrl.displayBudget(budget);

    }



    var ctrlAddItem = function () {

        var input, newItem;

        // 1. get the input data 
        input = UICtrl.getInput();
        //console.log(input);

        //var DOM = UICtrl.getDOMstrings();
        //console.log(DOM);


        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);


            // 3. add the item to the UI 
            UICtrl.addlistItem(newItem, input.type);

            // 4. clear the fields 
            UICtrl.clearFields();
            // stop repeating the steps so the rest of two steps will be re-written by function

            // 5.calculate the update budget 
            updateBudget();


            // 6. display the budget on the UI 


        }
    };

    return {
        init: function () {
            console.log("application has started");
            UICtrl.displayBudget({
                budget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1

            });
            setupEventListeners();

        }

    };




})(budgetController, UIController)
console.log("this is controller  including method listed below")
console.log(controller);

controller.init(); // with out this line , nothing will be happen.
