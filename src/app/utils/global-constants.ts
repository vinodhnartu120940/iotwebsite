export class GlobalConstants {
  public static phoneNumberPattern: string = '([+]{0,1}[0-9-() ]*)';
  // public static emailPattern: string =
  //   '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';    
  public static emailPattern: RegExp =
    /^(?![.])(?!.*(\.\.|[#]))[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  public static roleClaim = 'role';
  public static firstnamePattern = "^[a-zA-Z]+(?: [a-zA-Z]+)*$";
  public static companynamePattern =
    /^[a-zA-Z-._~!*'();:@&=+$,\s]+(\.[a-zA-Z]{2,}){0,2}$/;
  public static websitepattern = /^[a-zA-Z0-9\/?=.&-._~!*'();:+,$]+(\.[a-zA-Z]{2,}){1,2}$/;
  public static passwordpattern: string =
    '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=~`,.:;-]).*$';
  public static nameValidator = "^[a-zA-Z ]*$";
}
