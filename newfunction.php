<?php
// Register AJAX actions for both logged in and logged out users
add_action('wp_ajax_get_new_nonce', 'generate_new_game_nonce');
add_action('wp_ajax_nopriv_get_new_nonce', 'generate_new_game_nonce');

// Function to generate new nonce
function generate_new_game_nonce()
{
    // Generate a new nonce with a specific action name
    $nonce = wp_create_nonce('drive_game_nonce');

    // Send response back to JavaScript
    wp_send_json_success(array(
        'nonce' => $nonce
    ));
}

// Add this to localize the script and make ajax_url available
function enqueue_game_scripts()
{
    wp_enqueue_script('game-script', get_template_directory_uri() . '/js/custom.js', array('jquery'), '1.0', true);

    // Localize the script with new data
    wp_localize_script('game-script', 'ajax_object', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('drive_game_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_game_scripts');

// Add this function to verify nonce when needed
function verify_game_nonce($nonce)
{
    return wp_verify_nonce($nonce, 'drive_game_nonce');
}

function get_winner_function()
{
    // Verify the nonce
    if (!isset($_POST['security']) || !verify_game_nonce($_POST['security'])) {
        wp_send_json_error('Invalid security token');
        return;
    }

    $output = "";

    $data = $_POST['data'];
    $gamemail = isset($data['user_email']) ? sanitize_email($data['user_email']) : null; // Sanitize email

    // Prepare the arguments for the query
    $args = array(
        'post_type' => 'winner',
        'posts_per_page' => 5, // Limit to 5 posts
        'orderby' => 'meta_value_num', // Order by numeric meta value
        'order' => 'DESC', // Descending order
        'meta_key' => 'winner_score', // Specify the meta key to order by
        'post_status' => 'publish', // Only get published posts
        'meta_query' => array(
            array(
                'key' => 'winner_score',
                'type' => 'NUMERIC' // Ensure winner_score is treated as a number
            )
        ),
        'date_query' => array(
            array(
                'after' => $data['current_monday'], // Start of the week
                'before' => $data['current_sunday'], // End of the week
                'inclusive' => true, // Include the start and end dates
            ),
        ),
    );
    $winners = get_posts($args);

    // Loop through each winner post and retrieve ACF fields
    if ($winners) {
        foreach ($winners as $index => $winner) { // Add index to the loop
            $winner_data = get_fields($winner->ID); // Get all ACF fields for the winner
            // Determine the position
            $position = $index + 1;
            if ($index === 0) {
                $prposition = "gold";
                $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank1.png" class="rank" />';
            } elseif ($index === 1) {
                $prposition = "silver";
                $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank2.png" class="rank" />';
            } elseif ($index === 2) {
                $prposition = "bronze";
                $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank3.png" class="rank" />';
            } else {
                $prposition = "";
                $badge = '';
            }

            // Process the $winner_data as needed
            $output .= '<div class="row ' . esc_html($prposition) . '">';
            $output .= '<div class="badge">' . esc_html($position) . '.</div>';
            $output .= '<div class="name">' . $badge . esc_html($winner_data['winner_name']) . '</div>';
            $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
            $output .= '</div>';

            if ($gamemail === $winner_data['winner_email']) {
                $output .= '<div class="row player-row">';
                $output .= '<div class="badge">' . esc_html($position) . '.</div>';
                $output .= '<div class="name">' . $badge . 'You</div>';
                $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
                $output .= '</div>';
            }
        }
    } else {
        $output .= '<div class="no-winner">Currently no winner at this moment</div>';
    }

    wp_send_json_success($output);
}

add_action('wp_ajax_get_winner', 'get_winner_function');
add_action('wp_ajax_nopriv_get_winner', 'get_winner_function');

function save_game_winner()
{
    // Verify the nonce first
    if (!isset($_POST['security']) || !verify_game_nonce($_POST['security'])) {
        wp_send_json_error('Invalid security token');
        return;
    }

    $data = $_POST['data'];

    // Rate limiting logic
    $user_ip = $_SERVER['REMOTE_ADDR'];
    $submission_key = 'game_submission_' . $user_ip;

    // Check if user has submitted recently (within 30 seconds)
    if (get_transient($submission_key)) {
        wp_send_json_error('Please wait before submitting again');
        return;
    }

    // Set a transient to prevent rapid submissions
    set_transient($submission_key, true, 30); // 30 seconds cooldown

    // Validate the secure key
    if (!isset($_POST['secure_key']) || !validate_secure_key($_POST['secure_key'])) {
        wp_send_json_error('Invalid secure token');
        return;
    }

    // Split the string by the dot (.)
    $parts = explode('.', $data['winner_id']);

    // Assign the parts to variables
    $gs = $parts[0];
    $ge = $parts[1];
    $gc = $parts[2];
    $sc = $parts[3];
    $bc = $parts[4];

    $timediff =  $ge - $gs;
    $totalgold = $gc * 150;
    $totalsilver = $sc * 100;
    $totalbronze = $bc * 50;
    $expectScore = ($timediff * 9.82) + $totalgold + $totalsilver + $totalbronze;

    // Validate score format and range
    $winner_score = isset($data['winner_score']) ? intval($data['winner_score']) : 0;
    if ($winner_score <= 0 || $winner_score > 9999) { // Adjust max score as needed
        wp_send_json_error('Invalid score value');
        return;
    }

    $scoreDiff = abs($expectScore - $winner_score);
    if ($scoreDiff > 100) { // Adjust max score as needed
        wp_send_json_error('Invalid score value, please refresh the page');
        return;
    }

    // Add timestamp validation
    $current_time = time();
    $time_difference = abs($current_time - $ge);

    // Reject if submission time is too old or in future (5 minute window)
    if ($time_difference > 300) {
        wp_send_json_error('Score submission timeout');
        return;
    }

    $status = "";

    // Process the submission
    // Check if the form has been submitted
    if (isset($data['submit_winner'])) {
        $winner_name = sanitize_text_field($data['winner_name']);
        $winner_email = sanitize_email($data['winner_email']);
        $winner_score = intval($data['winner_score']);
        $current_week = date('W'); // Get the current week number

        // Ensure fields are not empty and score is valid
        if (!empty($winner_name) && is_email($winner_email) && $winner_score > 0) {

            // Query to check if a post with this winner email already exists
            $existing_winner = new WP_Query(array(
                'post_type' => 'winner',
                'meta_query' => array(
                    array(
                        'key' => 'winner_email',
                        'value' => $winner_email,
                        'compare' => '='
                    ),
                    array(
                        'key' => 'winner_week', // Check for the week
                        'value' => $current_week,
                        'compare' => '='
                    )
                )
            ));

            // Clear the submission cooldown if save was successful
            delete_transient($submission_key);

            if ($existing_winner->have_posts()) {
                // Update existing winner's score
                $existing_winner->the_post();
                $post_id = get_the_ID();

                // Get the current score and update it
                $current_score = get_field('winner_score', $post_id);
                $new_score = $winner_score; // Add the new score to the current score
                //If new score is higher than current score
                if ($new_score > $current_score) {
                    // Update the fields
                    update_field('winner_name', $winner_name, $post_id); // Update name if needed
                    update_field('winner_score', $new_score, $post_id);  // Update score
                }

                $status = "success";
            } else {
                // Create a new post for this winner
                $new_post = array(
                    'post_title'    => $winner_name, // Set the post title as the winner's name
                    'post_status'   => 'publish',    // Publish the post immediately
                    'post_type'     => 'winner',     // Custom post type 'winner'
                    'post_content'  => '',           // You can add more details here if needed
                );

                // Insert the new post into the database
                $post_id = wp_insert_post($new_post);

                // If the post was successfully created, save the custom fields
                if ($post_id) {
                    update_field('winner_name', $winner_name, $post_id);
                    update_field('winner_email', $winner_email, $post_id);
                    update_field('winner_score', $winner_score, $post_id);
                    update_field('winner_week', $current_week, $post_id);

                    $status = "success";
                } else {
                    $status = "fail";
                }
            }

            // Reset post data (important after WP_Query)
            wp_reset_postdata();

            // Regenerate nonce after successful submission
            wp_send_json_success('success');
        }
    }
}

add_action('wp_ajax_save_winner', 'save_game_winner');
add_action('wp_ajax_nopriv_save_winner', 'save_game_winner');

// Function to generate a secure key
function generate_secure_key()
{
    $key = bin2hex(random_bytes(8)); // Generate a secure random key
    set_transient('secure_key', $key, 60 * 5); // Store the key in a transient for 5 minutes
    return $key;
}

// Validate the secure key
function validate_secure_key($provided_key)
{
    $stored_key = get_transient('secure_key'); // Retrieve the key from transient
    return $provided_key === $stored_key; // Compare the provided key with the stored key
}

// Add this function to handle key generation
function get_secure_key()
{
    $key = generate_secure_key();
    wp_send_json_success(array('key' => $key)); // Send the key back to JS
}

// Add an AJAX action for generating the secure key
add_action('wp_ajax_get_secure_key', 'get_secure_key');
add_action('wp_ajax_nopriv_get_secure_key', 'get_secure_key');
