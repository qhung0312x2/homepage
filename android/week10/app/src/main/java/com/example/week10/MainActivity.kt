package com.example.week10

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    lateinit var nameObj: EditText //name 객제번수
    lateinit var passwordObj: EditText //password 객제번수
    lateinit var emailObj: EditText //email 객제번수
    lateinit var phoneObj: EditText //phone 객제번수
    lateinit var dateObj: EditText //date 객제번수
    lateinit var buttOnObj: Button //button 객제번수
    lateinit var resultObj: TextView //textView 객제번수

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        nameObj = findViewById(R.id.editName)
        passwordObj = findViewById(R.id.editPassword)
        emailObj = findViewById(R.id.editEmail)
        phoneObj = findViewById(R.id.editPhone)
        dateObj = findViewById(R.id.editDate)
        buttOnObj = findViewById(R.id.button)
        resultObj = findViewById(R.id.textView3)

        buttOnObj.setOnClickListener {
            if (nameObj.text.toString().isNotEmpty() &&
                passwordObj.text.toString().isNotEmpty() &&
                emailObj.text.toString().isNotEmpty() &&
                phoneObj.text.toString().isNotEmpty() &&
                dateObj.text.toString().isNotEmpty()
            ) {
                resultObj.text = "이름 : ${nameObj.text}\n" +
                        "비밀번호 : ${passwordObj.text}\n" +
                        "이메일 : ${emailObj.text}\n" +
                        "전화번호 : ${phoneObj.text}\n" +
                        "생년월일 : ${dateObj.text}"
            }
        }
    }
}