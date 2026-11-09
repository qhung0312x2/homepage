package com.example.may_tinh

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.text.DecimalFormat
import java.util.Stack

class MainActivity : AppCompatActivity() {

    private lateinit var tvExpression: TextView
    private lateinit var tvResult: TextView

    private var expression: String = ""
    private var isCalculated: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        initViews()
    }

    private fun initViews() {
        tvExpression = findViewById(R.id.tvExpression)
        tvResult = findViewById(R.id.tvResult)

        val digitsMap = mapOf(
            R.id.btn0 to "0",
            R.id.btn1 to "1",
            R.id.btn2 to "2",
            R.id.btn3 to "3",
            R.id.btn4 to "4",
            R.id.btn5 to "5",
            R.id.btn6 to "6",
            R.id.btn7 to "7",
            R.id.btn8 to "8",
            R.id.btn9 to "9"
        )

        for ((id, digit) in digitsMap) {
            findViewById<Button>(id).setOnClickListener {
                onDigitClicked(digit)
            }
        }

        findViewById<Button>(R.id.btnAdd).setOnClickListener { onOperatorClicked("+") }
        findViewById<Button>(R.id.btnSub).setOnClickListener { onOperatorClicked("-") }
        findViewById<Button>(R.id.btnMul).setOnClickListener { onOperatorClicked("×") }
        findViewById<Button>(R.id.btnDiv).setOnClickListener { onOperatorClicked("÷") }

        findViewById<Button>(R.id.btnC).setOnClickListener { onClearClicked() }
        findViewById<Button>(R.id.btnDel).setOnClickListener { onDeleteClicked() }
        findViewById<Button>(R.id.btnDot).setOnClickListener { onDotClicked() }
        findViewById<Button>(R.id.btnPercent).setOnClickListener { onPercentClicked() }
        findViewById<Button>(R.id.btnPlusMinus).setOnClickListener { onPlusMinusClicked() }
        findViewById<Button>(R.id.btnEquals).setOnClickListener { onEqualsClicked() }
    }

    private fun onDigitClicked(digit: String) {
        if (isCalculated) {
            expression = digit
            isCalculated = false
        } else {
            expression += digit
        }
        updateDisplay()
    }

    private fun onDotClicked() {
        if (isCalculated) {
            expression = "0."
            isCalculated = false
            updateDisplay()
            return
        }

        val lastNumber = expression.split(Regex("[+×÷\\-]")).lastOrNull() ?: ""
        if (!lastNumber.contains(".")) {
            if (expression.isEmpty() || isOperatorChar(expression.last())) {
                expression += "0."
            } else {
                expression += "."
            }
        }
        updateDisplay()
    }

    private fun onOperatorClicked(op: String) {
        if (isCalculated) {
            isCalculated = false
        }

        if (expression.isEmpty()) {
            if (op == "-") {
                expression = "-"
            }
            updateDisplay()
            return
        }

        val lastChar = expression.last()
        if (isOperatorChar(lastChar)) {
            expression = expression.dropLast(1) + op
        } else {
            expression += op
        }
        updateDisplay()
    }

    private fun onPlusMinusClicked() {
        if (expression.isEmpty()) return
        if (isCalculated) {
            isCalculated = false
        }

        var i = expression.length - 1
        while (i >= 0 && (expression[i].isDigit() || expression[i] == '.')) {
            i--
        }

        if (i < 0) {
            expression = if (expression.startsWith("-")) {
                expression.substring(1)
            } else {
                "-$expression"
            }
        } else if (expression[i] == '-') {
            if (i == 0 || isOperatorChar(expression[i - 1])) {
                expression = expression.removeRange(i, i + 1)
            } else {
                expression = expression.substring(0, i + 1) + "-" + expression.substring(i + 1)
            }
        } else {
            expression = expression.substring(0, i + 1) + "-" + expression.substring(i + 1)
        }
        updateDisplay()
    }

    private fun onPercentClicked() {
        if (expression.isNotEmpty() && !isOperatorChar(expression.last())) {
            expression += "%"
            updateDisplay()
        }
    }

    private fun onClearClicked() {
        expression = ""
        isCalculated = false
        tvExpression.text = ""
        tvResult.text = "0"
    }

    private fun onDeleteClicked() {
        if (isCalculated) {
            onClearClicked()
            return
        }
        if (expression.isNotEmpty()) {
            expression = expression.dropLast(1)
            updateDisplay()
        }
    }

    private fun onEqualsClicked() {
        if (expression.isEmpty()) return

        val res = evaluateExpression(expression)
        tvResult.text = res
        if (res != "Không thể chia cho 0" && res != "Lỗi") {
            expression = res
        }
        isCalculated = true
    }

    private fun updateDisplay() {
        tvExpression.text = expression
        if (expression.isEmpty()) {
            tvResult.text = "0"
            return
        }
        val preview = evaluateExpression(expression)
        if (preview != "Lỗi" && preview != "Không thể chia cho 0") {
            tvResult.text = preview
        }
    }

    private fun isOperatorChar(c: Char): Boolean {
        return c == '+' || c == '-' || c == '×' || c == '÷'
    }

    private fun evaluateExpression(expr: String): String {
        if (expr.isEmpty()) return "0"

        var cleanExpr = expr.replace("×", "*").replace("÷", "/")

        while (cleanExpr.isNotEmpty() && (isOperatorChar(cleanExpr.last()) || cleanExpr.last() == '*' || cleanExpr.last() == '/')) {
            cleanExpr = cleanExpr.dropLast(1).trim()
        }

        if (cleanExpr.isEmpty()) return "0"

        return try {
            val result = parseAndEvaluate(cleanExpr)
            if (result.isInfinite() || result.isNaN()) {
                "Không thể chia cho 0"
            } else {
                formatResult(result)
            }
        } catch (e: Exception) {
            "Lỗi"
        }
    }

    private fun parseAndEvaluate(expr: String): Double {
        val tokens = tokenize(expr)
        if (tokens.isEmpty()) return 0.0

        val rpn = shuntingYard(tokens)
        return evaluateRPN(rpn)
    }

    private fun tokenize(expr: String): List<String> {
        val tokens = mutableListOf<String>()
        var i = 0
        val n = expr.length

        while (i < n) {
            val c = expr[i]
            if (c.isWhitespace()) {
                i++
                continue
            }

            if (c.isDigit() || c == '.') {
                val sb = StringBuilder()
                while (i < n && (expr[i].isDigit() || expr[i] == '.')) {
                    sb.append(expr[i])
                    i++
                }
                tokens.add(sb.toString())
            } else if (c == '-' && (tokens.isEmpty() || isOperatorToken(tokens.last()))) {
                val sb = StringBuilder("-")
                i++
                while (i < n && expr[i].isWhitespace()) i++
                if (i < n && (expr[i].isDigit() || expr[i] == '.')) {
                    while (i < n && (expr[i].isDigit() || expr[i] == '.')) {
                        sb.append(expr[i])
                        i++
                    }
                    tokens.add(sb.toString())
                } else {
                    tokens.add("-")
                }
            } else if (c == '+' || c == '-' || c == '*' || c == '/' || c == '%') {
                tokens.add(c.toString())
                i++
            } else {
                i++
            }
        }
        return tokens
    }

    private fun isOperatorToken(token: String): Boolean {
        return token == "+" || token == "-" || token == "*" || token == "/" || token == "%"
    }

    private fun shuntingYard(tokens: List<String>): List<String> {
        val output = mutableListOf<String>()
        val stack = Stack<String>()

        for (token in tokens) {
            if (token.toDoubleOrNull() != null) {
                output.add(token)
            } else if (token == "%") {
                output.add(token)
            } else if (isOperatorToken(token)) {
                while (stack.isNotEmpty() && precedence(stack.peek()) >= precedence(token)) {
                    output.add(stack.pop())
                }
                stack.push(token)
            }
        }

        while (stack.isNotEmpty()) {
            output.add(stack.pop())
        }

        return output
    }

    private fun precedence(op: String): Int {
        return when (op) {
            "*", "/", "%" -> 2
            "+", "-" -> 1
            else -> 0
        }
    }

    private fun evaluateRPN(tokens: List<String>): Double {
        val stack = Stack<Double>()

        for (token in tokens) {
            val number = token.toDoubleOrNull()
            if (number != null) {
                stack.push(number)
            } else if (token == "%") {
                if (stack.isNotEmpty()) {
                    val a = stack.pop()
                    stack.push(a / 100.0)
                }
            } else if (isOperatorToken(token)) {
                if (stack.size < 2) continue
                val b = stack.pop()
                val a = stack.pop()
                val result = when (token) {
                    "+" -> a + b
                    "-" -> a - b
                    "*" -> a * b
                    "/" -> if (b == 0.0) Double.NaN else a / b
                    else -> 0.0
                }
                stack.push(result)
            }
        }

        return if (stack.isNotEmpty()) stack.pop() else 0.0
    }

    private fun formatResult(value: Double): String {
        if (value.isNaN() || value.isInfinite()) return "Lỗi"

        val longVal = value.toLong()
        return if (value == longVal.toDouble()) {
            longVal.toString()
        } else {
            val df = DecimalFormat("#.########")
            df.format(value)
        }
    }
}