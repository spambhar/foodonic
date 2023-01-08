from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

username='foodonic07@gmail.com'
password='ldhugbqponsnmvbn'
def send_mail(html, text='Email_body', subject='Hello world', from_email='', to_emails=[]):
    assert isinstance(to_emails, list)
    assert isinstance(to_emails,list)
    msg=MIMEMultipart('alternative')
    msg['From']=from_email
    msg['To']=", ".join(to_emails)
    msg['Subject']=subject

    html_part = MIMEText(f"<p>{text}</p>{html}", 'html')
    msg.attach(html_part)
    msg_str=msg.as_string()
    
    server=smtplib.SMTP(host='smtp.gmail.com',port=587)
    server.ehlo()
    server.starttls()
    server.login(username,password)
    server.sendmail(from_email,to_emails,msg_str)
    server.quit()

