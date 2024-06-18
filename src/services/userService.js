const UserModel = require("../dao/db/models/users.model")
const { createHash, isValidatePass } = require('../utils/crypt')
const { validatePasswordResetToken } = require("../utils/passwordReset");
const PasswordResetToken = require('../dao/db/models/passwordreset.model');

class UserManager {
  constructor() {}

  async createNewUser({ first_name, last_name, email, age, password }) {
    try {
        const user = await UserModel.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: createHash(password)
        });

        return { message: "Usuario creado correctamente", userData: user };
      } catch (error) {
        console.log(error);
    }
  }

  async findUser(email, password) {
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return { error: "Usuario no encontrado", statusCode: 404 };
      }

      const isValidPassword = isValidatePass(password, user.password);
  
      if (!isValidPassword) {
        return { error: "Contraseña incorrecta", statusCode: 401 };
      }

      return user;
    } catch (error) {
      console.error("Error en findUser:", error);
      return { error: "Error durante la autenticación", statusCode: 500 };
    }
  }

  async resetPassword(token, newPassword) {
    const isValidToken = await validatePasswordResetToken(token);
    if (isValidToken) {
      const resetToken = await PasswordResetToken.findOne({ token: token });
  
      if (!resetToken || resetToken.expires < Date.now()) {
        return { error: "Token inválido o expirado" };
      }

      if (resetToken.used) {
        return { error: "Token ya utilizado para restablecer la contraseña" };
      }
    
      const user = await UserModel.findById(resetToken.user);
      if (!user) {
        return { error: "Usuario no encontrado" };
      }
    
      if (isValidatePass(newPassword, user.password)) {
        return { error: "La nueva contraseña debe ser diferente a la actual." };
      }

      user.password = createHash(newPassword);
      await user.save();

      resetToken.used = true;
      await resetToken.save();
      
      return { message: "Contraseña cambiada correctamente" };
    } else {
      return { error: "Token invalido o expirado" };
    }
  }

 async toggleUserRole(userId) {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return { error: "Usuario no encontrado" };
        }

        const newRole = user.role === 'User' ? 'Premium' : 'User';

        user.role = newRole;

        await user.save();
        return { message: `Rol editado correctamente, ahora el usuario es ${newRole}` };
    } catch (error) {
      console.error("Error en toggleUserRole:", error);
      return { error: "Error al cambiar de rol al usuario" };
    }
}
}

module.exports = UserManager;
