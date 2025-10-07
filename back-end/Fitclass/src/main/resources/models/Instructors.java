package models;
@Entity
@Table(name = "instructors")
public class Instructors extends User {
    private String specialty;

    public Instructors(String username, String password, String specialty) {
        super(username, password);
        this.specialty = specialty;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
}
