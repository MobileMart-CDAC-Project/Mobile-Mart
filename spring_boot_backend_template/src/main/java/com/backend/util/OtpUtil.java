//generates a 6-digit numeric OTP (industry standard)

package com.backend.util;

import java.util.Random;

public class OtpUtil {

    private static final Random RANDOM = new Random();

    public static String generateOtp() {
        return String.valueOf(100000 + RANDOM.nextInt(900000));
    }
}
