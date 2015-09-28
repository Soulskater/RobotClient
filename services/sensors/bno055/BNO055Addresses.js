module.exports = {
    //I2C addresses
    bno055_address_a: 0x28,
    bno055_address_b: 0x29,
    bno055_id: 0xa0,

    //page id register definition
    bno055_page_id_addr: 0x07,

    //page 0 register definition start
    bno055_chip_id_addr: 0x00,
    bno055_accel_rev_id_addr: 0x01,
    bno055_mag_rev_id_addr: 0x02,
    bno055_gyro_rev_id_addr: 0x03,
    bno055_sw_rev_id_lsb_addr: 0x04,
    bno055_sw_rev_id_msb_addr: 0x05,
    bno055_bl_rev_id_addr: 0x06,

    //accel data register
    bno055_accel_data_x_lsb_addr: 0x08,
    bno055_accel_data_x_msb_addr: 0x09,
    bno055_accel_data_y_lsb_addr: 0x0a,
    bno055_accel_data_y_msb_addr: 0x0b,
    bno055_accel_data_z_lsb_addr: 0x0c,
    bno055_accel_data_z_msb_addr: 0x0d,

    //mag data register
    bno055_mag_data_x_lsb_addr: 0x0e,
    bno055_mag_data_x_msb_addr: 0x0f,
    bno055_mag_data_y_lsb_addr: 0x10,
    bno055_mag_data_y_msb_addr: 0x11,
    bno055_mag_data_z_lsb_addr: 0x12,
    bno055_mag_data_z_msb_addr: 0x13,

    //gyro data registers
    bno055_gyro_data_x_lsb_addr: 0x14,
    bno055_gyro_data_x_msb_addr: 0x15,
    bno055_gyro_data_y_lsb_addr: 0x16,
    bno055_gyro_data_y_msb_addr: 0x17,
    bno055_gyro_data_z_lsb_addr: 0x18,
    bno055_gyro_data_z_msb_addr: 0x19,

    //euler data registers
    bno055_euler_h_lsb_addr: 0x1a,
    bno055_euler_h_msb_addr: 0x1b,
    bno055_euler_r_lsb_addr: 0x1c,
    bno055_euler_r_msb_addr: 0x1d,
    bno055_euler_p_lsb_addr: 0x1e,
    bno055_euler_p_msb_addr: 0x1f,

    //quaternion data registers
    bno055_quaternion_data_w_lsb_addr: 0x20,
    bno055_quaternion_data_w_msb_addr: 0x21,
    bno055_quaternion_data_x_lsb_addr: 0x22,
    bno055_quaternion_data_x_msb_addr: 0x23,
    bno055_quaternion_data_y_lsb_addr: 0x24,
    bno055_quaternion_data_y_msb_addr: 0x25,
    bno055_quaternion_data_z_lsb_addr: 0x26,
    bno055_quaternion_data_z_msb_addr: 0x27,

    //linear acceleration data registers
    bno055_linear_accel_data_x_lsb_addr: 0x28,
    bno055_linear_accel_data_x_msb_addr: 0x29,
    bno055_linear_accel_data_y_lsb_addr: 0x2a,
    bno055_linear_accel_data_y_msb_addr: 0x2b,
    bno055_linear_accel_data_z_lsb_addr: 0x2c,
    bno055_linear_accel_data_z_msb_addr: 0x2d,

    //gravity data registers
    bno055_gravity_data_x_lsb_addr: 0x2e,
    bno055_gravity_data_x_msb_addr: 0x2f,
    bno055_gravity_data_y_lsb_addr: 0x30,
    bno055_gravity_data_y_msb_addr: 0x31,
    bno055_gravity_data_z_lsb_addr: 0x32,
    bno055_gravity_data_z_msb_addr: 0x33,

    //temperature data register
    bno055_temp_addr: 0x34,

    //status registers
    bno055_calib_stat_addr: 0x35,
    bno055_selftest_result_addr: 0x36,
    bno055_intr_stat_addr: 0x37,

    bno055_sys_clk_stat_addr: 0x38,
    bno055_sys_stat_addr: 0x39,
    bno055_sys_err_addr: 0x3a,

    //unit selection register
    bno055_unit_sel_addr: 0x3b,
    bno055_data_select_addr: 0x3c,

    //mode registers
    bno055_opr_mode_addr: 0x3d,
    bno055_pwr_mode_addr: 0x3e,

    bno055_sys_trigger_addr: 0x3f,
    bno055_temp_source_addr: 0x40,

    //axis remap registers
    bno055_axis_map_config_addr: 0x41,
    bno055_axis_map_sign_addr: 0x42,

    //axis remap values
    axis_remap_x: 0x00,
    axis_remap_y: 0x01,
    axis_remap_z: 0x02,
    axis_remap_positive: 0x00,
    axis_remap_negative: 0x01,

    //sic registers
    bno055_sic_matrix_0_lsb_addr: 0x43,
    bno055_sic_matrix_0_msb_addr: 0x44,
    bno055_sic_matrix_1_lsb_addr: 0x45,
    bno055_sic_matrix_1_msb_addr: 0x46,
    bno055_sic_matrix_2_lsb_addr: 0x47,
    bno055_sic_matrix_2_msb_addr: 0x48,
    bno055_sic_matrix_3_lsb_addr: 0x49,
    bno055_sic_matrix_3_msb_addr: 0x4a,
    bno055_sic_matrix_4_lsb_addr: 0x4b,
    bno055_sic_matrix_4_msb_addr: 0x4c,
    bno055_sic_matrix_5_lsb_addr: 0x4d,
    bno055_sic_matrix_5_msb_addr: 0x4e,
    bno055_sic_matrix_6_lsb_addr: 0x4f,
    bno055_sic_matrix_6_msb_addr: 0x50,
    bno055_sic_matrix_7_lsb_addr: 0x51,
    bno055_sic_matrix_7_msb_addr: 0x52,
    bno055_sic_matrix_8_lsb_addr: 0x53,
    bno055_sic_matrix_8_msb_addr: 0x54,

    //accelerometer offset registers
    accel_offset_x_lsb_addr: 0x55,
    accel_offset_x_msb_addr: 0x56,
    accel_offset_y_lsb_addr: 0x57,
    accel_offset_y_msb_addr: 0x58,
    accel_offset_z_lsb_addr: 0x59,
    accel_offset_z_msb_addr: 0x5a,

    //magnetometer offset registers
    mag_offset_x_lsb_addr: 0x5b,
    mag_offset_x_msb_addr: 0x5c,
    mag_offset_y_lsb_addr: 0x5d,
    mag_offset_y_msb_addr: 0x5e,
    mag_offset_z_lsb_addr: 0x5f,
    mag_offset_z_msb_addr: 0x60,

    //gyroscope offset registers
    gyro_offset_x_lsb_addr: 0x1,
    gyro_offset_x_msb_addr: 0x62,
    gyro_offset_y_lsb_addr: 0x63,
    gyro_offset_y_msb_addr: 0x64,
    gyro_offset_z_lsb_addr: 0x65,
    gyro_offset_z_msb_addr: 0x66,

    //radius registers
    accel_radius_lsbaddr: 0x67,
    accel_radius_msb_addr: 0x68,
    mag_radius_lsb_addr: 0x69,
    mag_radius_msb_addr: 0x6a,

    //power modes
    power_mode_normal: 0x00,
    power_mode_lowpower: 0x1,
    power_mode_suspend: 0x02,

    //operation mode settings
    operation_mode_config: 0x00,
    operation_mode_acconly: 0x0,
    operation_mode_magonly: 0x02,
    operation_mode_gyronly: 0x03,
    operation_mode_accmag: 0x04,
    operation_mode_accgyro: 0x0,
    operation_mode_maggyro: 0x06,
    operation_mode_amg: 0x07,
    operation_mode_imuplus: 0x08,
    operation_mode_compass: 0x09,
    operation_mode_m4g: 0x0a,
    operation_mode_ndof_fmcoff: 0x0b,
    operation_mode_ndof: 0x0c
};