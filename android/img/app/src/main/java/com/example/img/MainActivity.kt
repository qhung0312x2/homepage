package com.example.img

import android.content.res.ColorStateList
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.graphics.toColorInt
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    private lateinit var btnNext: Button
    private lateinit var imageView: ImageView

    private val images = listOf(
        R.drawable.img_1,
        R.drawable.img_2,
        R.drawable.img_3,
        R.drawable.img_4,
        R.drawable.img_5
    )

    private val buttonColors = listOf(
        "#6200EE".toColorInt(), // Tím
        "#03DAC5".toColorInt(), // Ngọc
        "#FF5722".toColorInt(), // Cam
        "#E91E63".toColorInt(), // Hồng
        "#4CAF50".toColorInt()  // Xanh lá
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        btnNext = findViewById(R.id.button)
        imageView = findViewById(R.id.imageView)

        var imageIndex = 0
        var colorIndex = 0

        // Đặt màu ban đầu cho nút
        btnNext.backgroundTintList = ColorStateList.valueOf(buttonColors[colorIndex])

        btnNext.setOnClickListener {
            // Đổi ảnh tiếp theo
            imageIndex = (imageIndex + 1) % images.size
            imageView.setImageResource(images[imageIndex])

            // Đổi màu nút tiếp theo
            colorIndex = (colorIndex + 1) % buttonColors.size
            btnNext.backgroundTintList = ColorStateList.valueOf(buttonColors[colorIndex])
        }
    }
}
