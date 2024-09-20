// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn submit(user: &str, pw: &str) -> String {
    format!("Usuário {} Senha {}", user, pw)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![submit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
